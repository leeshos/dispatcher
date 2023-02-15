import { Pressable, StyleSheet, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { TopBar } from '../../../components/common/TopBar'
import { FilterBar } from './FilterBar'
import { HeadLinesFeed } from './HeadLinesFeed'
import { useGetHeadLinesQuery } from 'features/api/apiSlice'
import { useMemo, useState } from 'react'
import { selectLoggedinUser } from 'features/authentication/reducers/loggedinUserSlice'
import { AppText } from 'components/common/AppText'
import Logo from '../assets/logo.svg'
import SearchIcon from '../assets/search.svg'
import RedDotIcon from '../assets/red-dot.svg'
import NotificationsIcon from '../assets/notifications.svg'
import { Strings } from 'constants'
import { navigate } from 'navigation/RootNavigation'
import { useAppSelector } from 'state/hooks'
import { selectNotifications } from 'features/notifications/reducers/notificationsSlice'

const Homepage = (): JSX.Element => {
    const loggedinUser = useAppSelector(selectLoggedinUser)
    const notifications = useAppSelector(selectNotifications)

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)

    const { data: headLines, isLoading, isSuccess, isError, error } = useGetHeadLinesQuery()

    const isUnreadNotifications = useMemo(() => {
        if (!notifications.length) return false
        return notifications.some(notification => notification.isUnread)
    }, [notifications])

    if (!loggedinUser) return <AppText>{Strings.MUST_BE_LOGGEDIN}</AppText>

    if (!headLines) return <AppText>{Strings.LOADING_TEXT}</AppText>

    return (
        <SafeAreaView style={styles.rootContainer}>
            {isFilterMenuOpen &&
                <Pressable
                    style={styles.backdrop}
                    onPress={() => { setIsFilterMenuOpen(false) }}
                >
                </Pressable>
            }
            <TopBar>
                <Logo />
                <View style={styles.iconsContainer}>
                    <View style={styles.iconContainer}>
                        <SearchIcon />
                    </View>
                    <View>
                        <Pressable onPress={() => { navigate('Notifications') }}>
                            <NotificationsIcon />
                        </Pressable>
                        <View style={styles.redDotContainer}>
                            {isUnreadNotifications && <RedDotIcon />}
                        </View>
                    </View>
                </View>
            </TopBar>
            <FilterBar
                loggedinUser={loggedinUser}
                setIsFilterMenuOpen={setIsFilterMenuOpen}
            />
            <HeadLinesFeed headLines={headLines} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexGrow: 1,
        position: 'relative',
        paddingBottom: 200,
    },
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 5
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 20,
    },
    redDotContainer: {
        position: 'absolute',
        top: -3,
        right: -1,
    },
})

export { Homepage }