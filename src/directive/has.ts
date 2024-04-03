import pinia from "@/store"
import useUserStore from "@/store/modules/user";

const useStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
    app.directive('has', {
        mounted(el: any, options: any) {
            if (!useStore.buttons.includes(options.value)) {
                el.parentNode.removeChild(el)
            }
        }
    })
}