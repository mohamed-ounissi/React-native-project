import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { TvMazeShowResponse, TvShowItem } from "@/types/tvmaze";
import { useLayoutMode } from "@/contexts/layout-mode-context";

const FALLBACK_POSTER = require("@/assets/images/no_pic.jpg");
const SHOWS_API_URL = "https://api.tvmaze.com/shows";

export default function HomeTabScreen() {
  const { mode } = useLayoutMode();
  const [items, setItems] = useState<TvShowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingMoreRef = useRef(false);
  const fetchedPagesRef = useRef<Set<number>>(new Set());

  const mapShowToItem = (show: TvMazeShowResponse): TvShowItem => {
    return {
      id: String(show.id),
      name: show.name,
      type: show.type,
      language: show.language,
      genres: show.genres,
      status: show.status,
      runtime: show.runtime,
      premiered: show.premiered,
      ended: show.ended,
      officialSite: show.officialSite,
      ratingAverage: show.rating.average,
      networkName: show.network?.name ?? null,
      imageMedium: show.image?.medium ?? null,
      imageOriginal: show.image?.original ?? null,
      summary: show.summary ? stripHtml(show.summary) : "No summary available.",
    };
  };

  const fetchPage = useCallback(async (targetPage: number, replace = false) => {
    if (!replace && fetchedPagesRef.current.has(targetPage)) {
      return;
    }

    if (replace) {
      setRefreshing(true);
      setError(null);
      setLoadMoreError(null);
      fetchedPagesRef.current.clear();
      isFetchingMoreRef.current = false;
    } else if (targetPage === 0) {
      setLoading(true);
      setError(null);
      setLoadMoreError(null);
      fetchedPagesRef.current.clear();
    } else {
      setFetchingMore(true);
      setLoadMoreError(null);
      isFetchingMoreRef.current = true;
    }

    try {
      const response = await fetch(`${SHOWS_API_URL}?page=${targetPage}`);

      if (!response.ok) {
        throw new Error("Failed to fetch shows");
      }

      const data = (await response.json()) as TvMazeShowResponse[];
      const mapped = data.map(mapShowToItem);

      setHasMore(mapped.length > 0);
      setPage(targetPage);
      fetchedPagesRef.current.add(targetPage);

      if (replace || targetPage === 0) {
        setItems(mapped);
        return;
      }

      setItems((prev) => [...prev, ...mapped]);
    } catch {
      if (replace || targetPage === 0) {
        setError("Something went wrong while loading items.");
        setItems([]);
      } else {
        setLoadMoreError("Could not load more shows.");
      }
    } finally {
      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
      isFetchingMoreRef.current = false;
    }
  }, []);

  useEffect(() => {
    void fetchPage(0);
  }, [fetchPage]);

  const loadNextPage = () => {
    if (loading || fetchingMore || refreshing || !hasMore || isFetchingMoreRef.current) {
      return;
    }

    isFetchingMoreRef.current = true;
    void fetchPage(page + 1);
  };

  const refreshList = () => {
    if (loading || refreshing || fetchingMore || isFetchingMoreRef.current) {
      return;
    }

    setHasMore(true);
    void fetchPage(0, true);
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.helperText}>Loading items...</Text>
      </View>
    );
  }

  if (error && items.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={() => void fetchPage(0)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main List</Text>
      <FlatList
        key={mode}
        data={items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={mode === "grid" ? 3 : 1}
        contentContainerStyle={
          mode === "grid" ? styles.gridContent : styles.listContent
        }
        columnWrapperStyle={mode === "grid" ? styles.gridRow : undefined}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
        }
        ListFooterComponent={
          fetchingMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#111827" />
            </View>
          ) : loadMoreError ? (
            <View style={styles.footerError}>
              <Text style={styles.footerErrorText}>{loadMoreError}</Text>
              <Pressable
                style={styles.footerRetryButton}
                onPress={() => void fetchPage(page + 1)}
              >
                <Text style={styles.footerRetryText}>Retry</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={mode === "grid" ? styles.gridItem : styles.itemCard}
            onPress={() =>
              router.push({
                pathname: "/details/[id]",
                params: { id: item.id },
              })
            }
          >
            {item.imageMedium ? (
              <Image
                source={{ uri: item.imageMedium }}
                style={mode === "grid" ? styles.gridPoster : styles.poster}
              />
            ) : (
              <View style={mode === "grid" ? styles.gridPosterFallback : styles.posterFallback}>
                <Image
                  source={FALLBACK_POSTER}
                  style={styles.fallbackImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {mode === "cards" ? (
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  {item.type} - {item.status}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.language} - Rating {item.ratingAverage ?? "N/A"}
                </Text>
                <Text style={styles.itemGenres} numberOfLines={1}>
                  {item.genres.join(" • ")}
                </Text>
              </View>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const stripHtml = (value: string): string => {
  return value.replace(/<[^>]*>/g, "").trim();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 12,
  },
  helperText: {
    marginTop: 10,
    fontSize: 14,
    color: "#475467",
  },
  errorText: {
    color: "#B42318",
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 20,
    gap: 10,
  },
  gridContent: {
    paddingBottom: 20,
    gap: 8,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  itemCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#F9FAFB",
    gap: 12,
  },
  gridItem: {
    width: "31%",
    marginBottom: 8,
  },
  poster: {
    width: 74,
    height: 108,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
  },
  gridPoster: {
    width: "100%",
    aspectRatio: 0.68,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
  },
  posterFallback: {
    width: 74,
    height: 108,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gridPosterFallback: {
    width: "100%",
    aspectRatio: 0.68,
    borderRadius: 8,
    backgroundColor: "#E4E7EC",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fallbackImage: {
    width: "100%",
    height: "100%",
  },
  itemContent: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    color: "#101828",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  itemMeta: {
    color: "#475467",
    fontSize: 13,
    marginBottom: 2,
  },
  itemGenres: {
    color: "#344054",
    fontSize: 12,
    marginTop: 4,
  },
  footerLoading: {
    paddingVertical: 14,
    alignItems: "center",
  },
  footerError: {
    paddingVertical: 12,
    alignItems: "center",
    gap: 8,
  },
  footerErrorText: {
    color: "#B42318",
    fontSize: 13,
  },
  footerRetryButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  footerRetryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
});
