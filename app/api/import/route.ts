import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertFetchableUrl, detectSourceType } from "@/lib/source";
import { extractWebRecipe } from "@/lib/extract";
import { fetchVideoMetadata } from "@/lib/ytdlp";
import { structureRecipe } from "@/lib/llm";
import { downloadImage } from "@/lib/images";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  const manualCaption =
    typeof body?.manualCaption === "string" ? body.manualCaption.trim() : "";

  if (!url) {
    return NextResponse.json({ error: "URL manquante." }, { status: 400 });
  }

  try {
    assertFetchableUrl(url);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "URL invalide." },
      { status: 400 },
    );
  }

  const sourceType = detectSourceType(url);

  let rawText: string;
  let imageUrl: string | undefined;

  try {
    if (sourceType === "web") {
      const result = await extractWebRecipe(url);
      rawText = result.rawText;
      imageUrl = result.imageUrl;
    } else if (manualCaption) {
      rawText = manualCaption;
    } else {
      const metadata = await fetchVideoMetadata(url);
      rawText = `Titre: ${metadata.title}\n\nLégende:\n${metadata.description}`;
      if (metadata.thumbnail) {
        imageUrl = await downloadImage(metadata.thumbnail);
      }
    }
  } catch (err) {
    console.error("Échec de l'extraction du contenu source:", err);
    if (sourceType !== "web" && !manualCaption) {
      return NextResponse.json(
        {
          error:
            "Impossible de récupérer automatiquement la légende de cette vidéo.",
          needsManualCaption: true,
        },
        { status: 422 },
      );
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Échec de l'extraction du contenu.",
      },
      { status: 422 },
    );
  }

  if (!rawText.trim()) {
    return NextResponse.json(
      { error: "Aucun contenu exploitable n'a été trouvé.", needsManualCaption: sourceType !== "web" },
      { status: 422 },
    );
  }

  try {
    const structured = await structureRecipe(rawText);
    return NextResponse.json({
      sourceUrl: url,
      sourceType,
      imageUrl,
      rawText,
      ...structured,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Échec de la structuration de la recette par l'IA.",
      },
      { status: 502 },
    );
  }
}
