import { NextResponse } from "next/server";
import { reindexAll } from "@/lib/search/indexer";

/**
 * Admin-only route to rebuild the search index.
 * Call this after seeding or bulk content updates.
 *
 * TODO: Add admin authentication check
 */
export async function POST() {
  try {
    await reindexAll();
    return NextResponse.json({ success: true, message: "Search index rebuilt" });
  } catch (error) {
    console.error("Reindex error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to rebuild index" },
      { status: 500 }
    );
  }
}
