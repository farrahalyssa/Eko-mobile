import React from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from "../../utils/Styles";
import { StackParamList, TabParamList } from "../../Types";
import ProfileStats from "../../components/ProfileStats";
import ProfilePosts from "../../components/ProfilePosts";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDateTimeMonthYear } from "../../utils/DateUtils";
import ProfileTopButton from "../../components/ProfileTopButton"; // Add the import for ProfileTopButton

type ExternalProfileNavigationProp = StackNavigationProp<StackParamList, 'ExternalProfile'>;
type ExternalProfileRouteProp = RouteProp<StackParamList, 'ExternalProfile'>;

export default function ExternalProfile() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<ExternalProfileNavigationProp>();
    const route = useRoute<ExternalProfileRouteProp>();

    // Extract the data passed from the Search screen
    const { userId, name, username, profilephoto_url, bio, createdAt } = route.params;
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
                            {profilephoto_url ? (
                                <Image source={{ uri: profilephoto_url }} style={styles.profileImage} resizeMode="cover"/>
                            ) : (
                                <Ionicons style={[styles.profileImage, { width: 145, height: 145 }]} name="person-circle" size={145} color="#CFE1D0" />
                            )}
                        </View>

                        <View style={[styles.userInfo, { marginLeft: 30 }]}>
                            <Text style={[styles.title]}>{name}</Text>
                            <Text style={[styles.subTitle]}>@{username}</Text>
                        </View>
                        <View style={[styles.bio]}>
                            <Text style={{marginLeft: 30}}>{bio}</Text>
                            <View style={styles.dateJoined}>
                                <Text style={{ color: "#777" }}>
                                    <Ionicons name="calendar-outline" size={15} color="#777" /> {createdAt ? (
                                        <Text>Joined in {formatDateTimeMonthYear(createdAt)}</Text>
                                    ) : (
                                        <Text>Joined date unavailable</Text>
                                    )}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <ProfileTopButton profileUserId={userId} />
                </View>      

                <ProfileStats userId={userId}/>
                <View style={{marginBottom: 10}}></View>
                <ProfilePosts profileUserId={userId}/>
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
