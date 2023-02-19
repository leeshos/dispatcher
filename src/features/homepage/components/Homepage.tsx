import { Pressable, StyleSheet, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { TopBar } from '../../../components/common/TopBar'
import { FilterBar } from './FilterBar'
import { HeadLinesFeed } from './HeadLinesFeed'
import { useGetHeadLinesQuery } from 'features/api/apiSlice'
import { useEffect, useMemo, useState } from 'react'
import { selectLoggedinUser } from 'features/authentication/reducers/loggedinUserSlice'
import { AppText } from 'components/common/AppText'
import Logo from '../assets/logo.svg'
import SearchIcon from '../assets/search.svg'
import RedDotIcon from '../assets/red-dot.svg'
import NotificationsIcon from '../assets/notifications.svg'
import { Colors, Strings } from 'constants'
import { navigate, push } from 'navigation/RootNavigation'
import { useAppSelector } from 'state/hooks'
import { selectNotifications } from 'features/notifications/reducers/notificationsSlice'
import { Loader } from 'components/common/Loader'
import { StackScreenProps } from '@react-navigation/stack'
import { HomepageStackParamList } from 'constants/screens'
import { TopBarSearch } from './TopBarSearch'

type HomepageProps = StackScreenProps<HomepageStackParamList, 'Homepage'>

const Homepage = ({ route: { params } }: HomepageProps): JSX.Element => {
    const loggedinUser = useAppSelector(selectLoggedinUser)
    const notifications = useAppSelector(selectNotifications)

    const { data: headLines, isLoading, isSuccess, isError, error } = useGetHeadLinesQuery()

    const [headLinesToDisplay, setHeadLinesToDisplay] = useState(headLines)
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)

    const isUnreadNotifications = useMemo(() => {
        if (!notifications.length) return false
        return notifications.some(notification => notification.isUnread)
    }, [notifications])

    useEffect(() => {
        isSuccess && setHeadLinesToDisplay(headLines)
    }, [isSuccess])

    useEffect(() => {
        if (params?.searchValue && headLinesToDisplay) {
            setHeadLinesToDisplay(
                headLinesToDisplay.filter(
                    headLine => headLine.title.toLowerCase().includes(params.searchValue.toLowerCase())
                )
            )
        }
    }, [params])

    if (!loggedinUser) return <AppText>{Strings.MUST_BE_LOGGEDIN}</AppText>
    if (isLoading) return <Loader />
    if (!headLinesToDisplay) return <AppText>{Strings.GENERAL_ERROR}</AppText>

    return (
        <SafeAreaView style={styles.rootContainer}>
            {isFilterMenuOpen &&
                <Pressable
                    style={styles.backdrop}
                    onPress={() => { setIsFilterMenuOpen(false) }}
                >
                </Pressable>
            }
            {params?.searchValue
                ? <TopBarSearch searchValue={params.searchValue} />
                : <TopBar>
                    <Logo />
                    <View style={styles.iconsContainer}>
                        <Pressable
                            style={styles.iconContainer}
                            onPress={() => { push('Search') }}
                        >
                            <SearchIcon />
                        </Pressable>
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
            }
            <FilterBar setIsFilterMenuOpen={setIsFilterMenuOpen} />
            <HeadLinesFeed
                headLines={headLinesToDisplay}
                loggedinUser={loggedinUser}
                isSearch={!!params?.searchValue}
            />
            {params?.searchValue && headLinesToDisplay.length === 0 &&
                <AppText styleProps={styles.noResults}>{Strings.NO_RESULTS}</AppText>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        flexGrow: 1,
        position: 'relative',
        paddingBottom: 80,
        backgroundColor: Colors.BLUE100,
    },
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        start: 0,
        end: 0,
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
        marginEnd: 20,
    },
    redDotContainer: {
        position: 'absolute',
        top: -3,
        end: -1,
    },
    noResults: {
        alignSelf: 'center',
        marginTop: 20,
    }
})

export { Homepage }