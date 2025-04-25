import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import userService from '../../services/userService';
import { FeedItem, FeedGroup } from '../../types/feedTypes';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FeedScreen = () => {
  const [feedData, setFeedData] = useState<FeedGroup>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const extractVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const fetchFeed = async (pageNum: number = 1, shouldRefresh: boolean = false) => {
    try {
      const response = await userService.getFeed(pageNum);
      if (response.success) {
        if (shouldRefresh) {
          setFeedData(response.data.items);
        } else {
          setFeedData(prev => ({ ...prev, ...response.data.items }));
        }
        setHasMore(response.data.pagination.has_more);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchFeed(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(nextPage);
    }
  };

  const handleVideoPress = (videoId: string) => {
    setPlayingVideoId(playingVideoId === videoId ? null : videoId);
  };

  const renderFeedItem = ({ item }: { item: FeedItem }) => {
    const videoId = item.media_type === 'video' ? extractVideoId(item.media_url) : null;
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    return (
      <View style={styles.feedItem}>
        <View style={styles.userInfo}>
          <View style={styles.userInfoLeft}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.username}>{item.user.name}</Text>
              <Text style={styles.date}>{formatDate(item.upload_date)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {item.media_type === 'photo' ? (
          <Image source={{ uri: item.media_url }} style={styles.media} />
        ) : videoId ? (
          <View style={styles.videoContainer}>
            {playingVideoId === videoId ? (
              <YoutubePlayer
                height={300}
                play={true}
                videoId={videoId}
                onChangeState={(state) => {
                  if (state === 'ended') {
                    setPlayingVideoId(null);
                  }
                }}
              />
            ) : (
              <TouchableOpacity onPress={() => handleVideoPress(videoId)}>
                {thumbnailUrl && (
                  <Image source={{ uri: thumbnailUrl }} style={styles.media} />
                )}
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
                  style={styles.playButton}
                >
                  <View style={styles.playButtonInner}>
                    <Ionicons name="play" size={40} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="alert-circle-outline" size={40} color="#666" />
            <Text style={styles.placeholderText}>Invalid Video URL</Text>
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#666" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDateGroup = ({ item: date }: { item: string }) => (
    <View style={styles.dateGroup}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.dateHeader}
      >
        <Text style={styles.dateHeaderText}>{formatDate(date)}</Text>
      </LinearGradient>
      <FlatList
        data={feedData[date]}
        renderItem={renderFeedItem}
        keyExtractor={(item) => `feed-${item.id}`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(feedData)}
        renderItem={renderDateGroup}
        keyExtractor={(date) => `date-${date}`}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    padding: 12,
    marginBottom: 8,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  feedItem: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  media: {
    width: '100%',
    height: width * 0.75,
    resizeMode: 'cover',
  },
  videoContainer: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    width: '100%',
    height: width * 0.75,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6c757d',
    marginTop: 8,
    fontSize: 14,
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    padding: 12,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
});

export default FeedScreen; 