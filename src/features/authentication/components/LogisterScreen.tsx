import { useState } from 'react'
import { View, Text, StyleSheet } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { AppInput, ContentType } from 'components/common/AppInput'
import { HorizontalLine } from 'components/common/HorizontalLine'
import LogisterButton from 'components/common/LogisterButton'
import { validateConfirmPassword, validateEmail, validatePassword } from 'utils/validationUtils'
import { firebaseLogin, firebaseSignup } from 'utils/firebaseAuthUtils'
import { showAlertMessage } from 'utils/userMsgsUtils'
import { Colors } from 'constants/index'
import { Strings } from 'constants/index'
import Logo from '../assets/logo.svg'
import ArrowRight from '../../../../assets/arrow-right.svg'
interface LogisterScreenProps {
}

enum Status {
    Login = 'Login',
    Signup = 'Signup',
}

const LogisterScreen = ({ }: LogisterScreenProps): JSX.Element => {

    const [status, setStatus] = useState<Status>(Status.Signup)

    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState('')

    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState('')

    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const onSignup = () => {
        if (emailError || passwordError || confirmPasswordError || !email || !password || !confirmPassword)
            showAlertMessage('Oh oh!', 'Please fill out the form correctly.')
        else firebaseSignup(email, password)
    }

    const onLogin = () => {
        if (emailError || passwordError || confirmPasswordError || !email || !password)
            showAlertMessage('Oh oh!', 'Please fill out the form correctly.')
        else firebaseLogin(email, password)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.rootContainer}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                <View style={styles.mainContainer}>
                    <View>
                        <Text style={styles.formTitle}>{status}</Text>
                        <View>
                            <AppInput
                                value={email}
                                setValue={setEmail}
                                placeholderText={Strings.EMAIL_PLACEHOLDER}
                                contentType={ContentType.email}
                                validate={validateEmail}
                                styleProps={{ marginBottom: 24 }}
                                error={emailError}
                                setError={setEmailError}
                            />
                            <AppInput
                                value={password}
                                setValue={setPassword}
                                placeholderText={Strings.PASSWORD_PLACEHOLDER}
                                contentType={ContentType.password}
                                validate={validatePassword}
                                styleProps={{ marginBottom: 24 }}
                                error={passwordError}
                                setError={setPasswordError}
                            />
                            {(status === Status.Signup) && <AppInput
                                value={confirmPassword}
                                confirmValue={password}
                                setValue={setConfirmPassword}
                                placeholderText={Strings.CONFIRM_PASSWORD_PLACEHOLDER}
                                contentType={ContentType.password}
                                confirmValidate={validateConfirmPassword}
                                error={confirmPasswordError}
                                setError={setConfirmPasswordError}
                            />}
                        </View>
                    </View>
                    <HorizontalLine />
                    <View style={styles.buttonsContainer}>
                        <LogisterButton
                            onPress={() => (status === Status.Login) ? onLogin() : onSignup()}
                            bgColor={(status === Status.Signup) ? Colors.BLUE500 : Colors.BLUE300}
                            containerStyle={{ marginBottom: 24 }}
                            icon={<ArrowRight />}
                        >{status.toUpperCase()}
                        </LogisterButton>
                        <LogisterButton
                            onPress={() => setStatus((status === Status.Login) ? Status.Signup : Status.Login)}
                            bgColor={Colors.GRAY500}
                            textStyle={styles.secondaryButtonText}
                        >{(status === Status.Login) ? Status.Signup.toUpperCase() : Status.Login.toUpperCase()}
                        </LogisterButton>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexGrow: 1,
        height: '100%',
    },
    logoContainer: {
        height: '35%',
        backgroundColor: Colors.BLUE800,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.BLUE100,
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },
    formTitle: {
        color: Colors.BLUE400,
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        paddingLeft: 10,
        paddingBottom: 12,
    },
    buttonsContainer: {
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: Colors.BLUE400,
        fontWeight: '400',
    }
})

export { LogisterScreen }