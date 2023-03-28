import { extendTheme } from "@chakra-ui/react"
import "@fontsource/sarpanch"

export const theme = extendTheme({
    colors: {
        brand: {
            purple: "#171123",
            golden: "#C89300",
            platinum: "#E5E7E6",
            gray: "#797B84",
        },
    },
    fonts: {
        heading: `'Sarpanch', sans-serif`,
        body: `'Sarpanch', sans-serif`,
    },

})