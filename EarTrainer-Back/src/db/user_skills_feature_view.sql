CREATE OR REPLACE VIEW user_skill_features_view AS
SELECT
    u.id AS user_id,
    -- Precisión en ejercicios fáciles
    COALESCE(acc_easy.accuracy, 0.0) AS accuracy_easy,
    -- Precisión en ejercicios de dificultad media
    COALESCE(acc_medium.accuracy, 0.0) AS accuracy_medium,
    -- Precisión en ejercicios difíciles
    COALESCE(acc_hard.accuracy, 0.0) AS accuracy_hard,
    -- Tiempo de respuesta promedio
    COALESCE(atr.avg_time_response, 0.0) AS avg_response_time,
    -- Número de sesiones de juego completadas que cumplen con los criterios de intentos
    COALESCE(gp.games_played, 0) AS games_played,
    -- Duración promedio de las sesiones de juego (en segundos)
    COALESCE(asd.avg_session_duration_seconds, 0.0) AS avg_session_duration
FROM
    users u
LEFT JOIN (
    -- Subconsulta para calcular la precisión en sesiones 'easy'
    SELECT
        ts.user_id,
        CAST(SUM(CASE WHEN ntl.es_correcto THEN 1 ELSE 0 END) AS REAL) / COUNT(ntl.id) AS accuracy
    FROM
        training_sessions ts
    JOIN
        note_training_logs ntl ON ts.id = ntl.session_id
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.dificultad = 'easy' AND
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        session_attempts.attempt_count >= 5 -- 5 intentos para easy
    GROUP BY
        ts.user_id
) AS acc_easy ON u.id = acc_easy.user_id
LEFT JOIN (
    -- Subconsulta para calcular la precisión en sesiones 'medium'
    SELECT
        ts.user_id,
        CAST(SUM(CASE WHEN ntl.es_correcto THEN 1 ELSE 0 END) AS REAL) / COUNT(ntl.id) AS accuracy
    FROM
        training_sessions ts
    JOIN
        note_training_logs ntl ON ts.id = ntl.session_id
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.dificultad = 'medium' AND
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        session_attempts.attempt_count >= 10 -- 10 intentos para medium
    GROUP BY
        ts.user_id
) AS acc_medium ON u.id = acc_medium.user_id
LEFT JOIN (
    -- Subconsulta para calcular la precisión en sesiones 'hard'
    SELECT
        ts.user_id,
        CAST(SUM(CASE WHEN ntl.es_correcto THEN 1 ELSE 0 END) AS REAL) / COUNT(ntl.id) AS accuracy
    FROM
        training_sessions ts
    JOIN
        note_training_logs ntl ON ts.id = ntl.session_id
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.dificultad = 'hard' AND
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        session_attempts.attempt_count >= 10 -- 10 intentos para hard
    GROUP BY
        ts.user_id
) AS acc_hard ON u.id = acc_hard.user_id
LEFT JOIN (
    -- Subconsulta para calcular el tiempo de respuesta promedio de las sesiones que cumplen con los criterios
    SELECT
        ts.user_id,
        AVG(ntl.tiempo_respuesta) AS avg_time_response
    FROM
        training_sessions ts
    JOIN
        note_training_logs ntl ON ts.id = ntl.session_id
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        (
            (ts.dificultad = 'easy' AND session_attempts.attempt_count >= 5) OR
            ((ts.dificultad = 'medium' OR ts.dificultad = 'hard') AND session_attempts.attempt_count >= 10)
        )
    GROUP BY
        ts.user_id
) AS atr ON u.id = atr.user_id
LEFT JOIN (
    -- Subconsulta para contar los juegos jugados (sesiones completadas que cumplen con los criterios de intentos)
    SELECT
        ts.user_id,
        COUNT(ts.id) AS games_played
    FROM
        training_sessions ts
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        (
            (ts.dificultad = 'easy' AND session_attempts.attempt_count >= 5) OR
            ((ts.dificultad = 'medium' OR ts.dificultad = 'hard') AND session_attempts.attempt_count >= 10)
        )
    GROUP BY
        ts.user_id
) AS gp ON u.id = gp.user_id
LEFT JOIN (
    -- Subconsulta para calcular la duración promedio de las sesiones (en segundos)
    SELECT
        ts.user_id,
        CAST(AVG(EXTRACT(EPOCH FROM (ts.finished_at - ts.started_at))) AS DOUBLE PRECISION) AS avg_session_duration_seconds
    FROM
        training_sessions ts
    JOIN
        (SELECT session_id, COUNT(id) AS attempt_count FROM note_training_logs GROUP BY session_id) AS session_attempts
        ON ts.id = session_attempts.session_id
    WHERE
        ts.finished_at IS NOT NULL AND -- La sesión debe haber terminado
        (
            (ts.dificultad = 'easy' AND session_attempts.attempt_count >= 5) OR
            ((ts.dificultad = 'medium' OR ts.dificultad = 'hard') AND session_attempts.attempt_count >= 10)
        )
    GROUP BY
        ts.user_id
) AS asd ON u.id = asd.user_id;