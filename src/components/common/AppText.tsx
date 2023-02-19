import { Colors, Fonts } from 'constants'
import { fontWeight } from 'models/font-weight'
import { Text, StyleSheet } from "react-native"

interface AppTextProps {
    children: string
    styleProps?: {
        fontSize?: number
        color?: string
        fontFamily?: string
        fontWeight?: fontWeight
        marginBottom?: number
        paddingStart?: number
        maxWidth?: number | string
        paddingBottm?: number
        paddingTop?: number
    }
}

const AppText = ({ children, styleProps }: AppTextProps): JSX.Element => {

    return (
        <Text style={[styles.text, styleProps]}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.ROBOTO_REGULAR,
        fontSize: 14,
        color: Colors.BLUE400,
    }
})

export { AppText }