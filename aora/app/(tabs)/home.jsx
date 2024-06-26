import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View, TouchableOpacity } from "react-native";
import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts, getCurrentUser } from "../../lib/appwrite";
import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";
import { router } from "expo-router";
const Home = () => {
    const { data: posts, refetch } = useAppwrite(getAllPosts);
    const { data: latestPosts } = useAppwrite(getLatestPosts);
    const { data: user } = useAppwrite(getCurrentUser);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    // const chat = () => {
    //     router.replace("chat")
    // }

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item?.creator.username}
                        avatar={item.creator.avatar}
                        isUserPost={item.creator.$id === user?.$id}
                        videoId={item.$id}
                        isBottomShow={true}
                        creatorId={item.creator.$id}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Welcome Back
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    {user?.username ?? "Unknown User"}
                                </Text>
                            </View>

                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    className="w-8 h-8"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <SearchInput placeholder="Search for a video topic" />

                        <View className="flex-1 w-full pt-2 pb-2">
                            <Text className="text-lg font-pregular text-gray-100 mb-3">
                                Latest Videos
                            </Text>

                            <Trending posts={latestPosts ?? []} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos created yet"
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    );
};

export default Home;