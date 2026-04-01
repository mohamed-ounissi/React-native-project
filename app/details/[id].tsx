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
        <Image
          source={item.imageOriginal ? { uri: item.imageOriginal } : FALLBACK_POSTER}
          style={styles.poster}
        />

        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>Type: {item.type}</Text>
        <Text style={styles.meta}>Language: {item.language}</Text>
        <Text style={styles.meta}>Status: {item.status}</Text>
        <Text style={styles.meta}>Runtime: {item.runtime ?? "N/A"} min</Text>
        <Text style={styles.meta}>Premiered: {item.premiered ?? "N/A"}</Text>
        <Text style={styles.meta}>Ended: {item.ended ?? "N/A"}</Text>
        <Text style={styles.meta}>Rating: {item.ratingAverage ?? "N/A"}</Text>
        <Text style={styles.meta}>Network: {item.networkName ?? "N/A"}</Text>
        <Text style={styles.meta}>Genres: {item.genres.join(", ")}</Text>

        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.description}>{item.summary}</Text>

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
    backgroundColor: "#FFFFFF",
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  poster: {
    width: "100%",
    height: 340,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#EAECF0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 16,
  },
  meta: {
    fontSize: 14,
    color: "#475467",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#344054",
    marginBottom: 20,
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
    marginTop: 10,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
