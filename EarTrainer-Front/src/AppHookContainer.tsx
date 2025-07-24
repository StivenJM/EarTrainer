import { Provider } from "react-redux"
import App from "./App"
import { store } from "./redux/store"

export const AppHookContainer = () => {
    return (
        <Provider store={store}>
            <App>
            </App>
        </Provider>
    )
}