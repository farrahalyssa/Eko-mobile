import React, { useCallback, useEffect, useState } from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUserData, getUserData } from "../../utils/data"; // Import getUserData
import { styles } from "../../utils/Styles";
import { TabParamList } from "../../Types";
import ProfileStats from "../../components/ProfileStats";
import Activity from "../../components/Activity";
import ProfileTopButton from "../../components/ProfileTopButton";
import Posts from "../../components/Posts";
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // To account for safe areas on iOS
import { formatDateTimeMonthYear } from "../../utils/DateUtils";
export default function Profile() {
    const insets = useSafeAreaInsets(); 
    type ProfileNavigationProp = StackNavigationProp<TabParamList, 'Profile'>;
    const navigation = useNavigation<ProfileNavigationProp>();

    const { userData, setUserData, loading, error } = useUserData();

    const [refreshing, setRefreshing] = useState(false);
    // Function to refresh the profile data
    const refreshProfile = useCallback(async () => {
        setRefreshing(true);
        try {
            const updatedUserData = await getUserData();
            if (updatedUserData) {
                setUserData(updatedUserData);
            }
        } catch (error) {
            console.error('Error refreshing profile data:', error);
        } finally {
            setRefreshing(false);
        }
    }, [setUserData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshProfile();
        });

        return unsubscribe;
    }, [navigation, refreshProfile]);

    return (
        <View>
            <ScrollView>
                <TouchableOpacity style={styles.headerImageContainer}>
                    <Image 
                        source={{ uri: '../../assets/images/DefaultImage.png' }} 
                        style={styles.headerImage} 
                    />
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={28}  color='rgba(0, 0, 0, 0.3)' />
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                        {userData?.profilephoto_url ? (
                     <Image source={{ uri: userData.profilephoto_url }}style={styles.profileImage} resizeMode="cover"/>):(<Ionicons  style={[styles.profileImage, { width: 145, height: 145 }]}name="person-circle" size={145} color="#CFE1D0" />)}   
                        </View>

                        {loading ? (
                            <Text>Fetching profile details...</Text>
                        ) : error ? (
                            <Text>Error loading profile data.</Text>
                        ) : userData ? (
                            <>
                                <View style={[styles.userInfo, { marginLeft: 30 }]}>
                                    <Text style={[styles.title]}>{userData.name}</Text>
                                    <Text style={[styles.subTitle]}>@{userData.username}</Text>
                                </View>
                                <View style={[styles.bio,]}>
                                    <Text style={{marginLeft: 30}}>{userData.bio}</Text>
                                    <View style={styles.dateJoined}>
                                        <Text style={{ color: "#777" }}>
                                            <Ionicons name="calendar-outline" size={15} color="#777" /> {userData?.createdAt ? (
                                        <Text>Joined in {formatDateTimeMonthYear(userData.createdAt)}</Text>
                                        ) : (
                                        <Text>Joined date unavailable</Text>
                                        )}
                                        </Text>
                                    </View>
                                </View>
                            </>
                        ) : null}
                    </View>
                    <ProfileTopButton profileUserId={userData?.userId || ""}/>
                </View>      

                <ProfileStats userId={userData?.userId || ""} />
                <View style={{marginBottom: 10}}></View>
                {/* <Activity /> */}
                <Posts profileUserId={userData?.userId || ""}/>
            </ScrollView>

            <View>
                <TouchableOpacity 
                    onPress={() => { navigation.navigate('AddPost'); }}
                    style={[
                        styles.aboveNavFab,
                        { bottom: 10 },
                    ]}>
                    <Ionicons name="add-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>  
    );
}
