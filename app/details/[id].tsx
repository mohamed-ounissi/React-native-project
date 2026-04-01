import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import { TvMazeShowResponse, TvShowItem } from "@/types/tvmaze";

const FALLBACK_POSTER = require("@/assets/images/no_pic.jpg");

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<TvShowItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const loadDetails = useCallback(() => {
    if (!id) {
      setError("Item not found.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://api.tvmaze.com/shows/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }

        const data = (await response.json()) as TvMazeShowResponse;

        setItem({
          id: String(data.id),
          name: data.name,
          type: data.type,
          language: data.language,
          genres: data.genres,
          status: data.status,
          runtime: data.runtime,
          premiered: data.premiered,
          ended: data.ended,
          officialSite: data.officialSite,
          ratingAverage: data.rating.average,
          networkName: data.network?.name ?? null,
          imageMedium: data.image?.medium ?? null,
          imageOriginal: data.image?.original ?? null,
          summary: data.summary
            ? data.summary.replace(/<[^>]*>/g, "").trim()
            : "No summary available.",
        });
      } catch {
        setError("Failed to load show details.");
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchDetails();
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  useEffect(() => {
    setImageLoading(Boolean(item?.imageOriginal));
  }, [item?.imageOriginal]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContent}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.helperText}>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error ?? "Item not found."}</Text>
        <Pressable style={styles.button} onPress={loadDetails}>
          <Text style={styles.buttonText}>Retry</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.posterWrapper}>
            <Image
              source={item.imageOriginal ? { uri: item.imageOriginal } : FALLBACK_POSTER}
              style={styles.poster}
              onLoadStart={() => {
                if (item.imageOriginal) setImageLoading(true);
              }}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            {imageLoading ? (
              <View style={styles.posterLoaderOverlay}>
                <ActivityIndicator size="small" color="#111827" />
              </View>
            ) : null}
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Rating {item.ratingAverage ?? "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Show Details</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Language</Text>
            <Text style={styles.metaValue}>{item.language}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Runtime</Text>
            <Text style={styles.metaValue}>{item.runtime ?? "N/A"} min</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Premiered</Text>
            <Text style={styles.metaValue}>{item.premiered ?? "N/A"}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Ended</Text>
            <Text style={styles.metaValue}>{item.ended ?? "N/A"}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Network</Text>
            <Text style={styles.metaValue}>{item.networkName ?? "N/A"}</Text>
          </View>
          <View style={styles.metaRowLast}>
            <Text style={styles.metaLabel}>Genres</Text>
            <Text style={styles.metaValue}>{item.genres.join(", ") || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.description}>{item.summary}</Text>
        </View>


        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back to List</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 10,
    fontSize: 14,
    color: "#475467",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 14,
  },
  heroCard: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAECF0",
    shadowColor: "#101828",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  heroContent: {
    marginTop: 12,
  },
  poster: {
    width: "100%",
    height: 340,
    borderRadius: 12,
    backgroundColor: "#EAECF0",
  },
  posterWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  posterLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#3538CD",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
    gap: 10,
  },
  metaRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 8,
    gap: 10,
  },
  metaLabel: {
    fontSize: 13,
    color: "#475467",
    fontWeight: "600",
  },
  metaValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "#101828",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#344054",
  },
  errorText: {
    fontSize: 16,
    color: "#B42318",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D5DD",
  },
  secondaryButtonText: {
    color: "#344054",
    fontWeight: "700",
  },
});
