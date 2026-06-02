import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  BookmarkPlus,
  BookmarkCheck,
  Filter,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { loadSavedResourceIds, persistSavedResourceIds } from "../../utils/librarySaved";
import {
  libraryAssetsUseSupabaseStorage,
  probeHttpExists,
  resolveLibraryFileUrl,
} from "../../utils/libraryAssets";

type ResourceType = "guide" | "checklist" | "video" | "article";
type ResourceCategory =
  | "all"
  | "home-safety"
  | "caregiving"
  | "health"
  | "planning"
  | "wellness";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: ResourceCategory;
  duration?: string;
  format?: string;
  /** Resolved open/download URL (Supabase Storage public URL or demo PDF). */
  fileUrl?: string;
  /** Storage mode: probing whether the public object exists. */
  assetCheckPending?: boolean;
}

type ResourceDefinition = Omit<Resource, "fileUrl" | "assetCheckPending">;

const LIBRARY_DEFINITIONS: ResourceDefinition[] = [
  {
    id: "1",
    title: "Complete Home Safety Checklist",
    description:
      "Comprehensive room-by-room checklist to identify and address potential safety hazards in your home.",
    type: "checklist",
    category: "home-safety",
    format: "PDF",
  },
  {
    id: "2",
    title: "Fall Prevention Guide",
    description:
      "Evidence-based strategies and exercises to reduce fall risk and maintain mobility at home.",
    type: "guide",
    category: "home-safety",
    format: "PDF",
  },
  {
    id: "3",
    title: "Caregiver Self-Care Workbook",
    description:
      "Tools and exercises to help caregivers maintain their own physical and emotional wellbeing.",
    type: "guide",
    category: "caregiving",
    format: "PDF",
  },
  {
    id: "4",
    title: "Understanding Dementia Care",
    description:
      "Educational video series on providing compassionate, effective care for individuals with dementia.",
    type: "video",
    category: "caregiving",
    duration: "45 min",
  },
  {
    id: "5",
    title: "Medication Management Tracker",
    description:
      "Printable chart to organize medications, dosages, and schedule for safe medication management.",
    type: "checklist",
    category: "health",
    format: "PDF",
  },
  {
    id: "6",
    title: "Advance Care Planning Workbook",
    description:
      "Step-by-step guide to documenting healthcare preferences and wishes for future care.",
    type: "guide",
    category: "planning",
    format: "PDF",
  },
  {
    id: "7",
    title: "Nutrition for Healthy Aging",
    description:
      "Evidence-based nutrition guidelines, meal planning tips, and recipes for older adults.",
    type: "article",
    category: "wellness",
  },
  {
    id: "8",
    title: "Emergency Preparedness Checklist",
    description:
      "Essential steps and supplies needed to prepare for emergencies while aging in place.",
    type: "checklist",
    category: "planning",
    format: "PDF",
  },
  {
    id: "9",
    title: "Communication Strategies for Families",
    description:
      "Tips and techniques for having difficult conversations about aging and care needs.",
    type: "guide",
    category: "caregiving",
    format: "PDF",
  },
  {
    id: "10",
    title: "Home Modifications Guide",
    description:
      "Comprehensive guide to accessibility modifications, from simple changes to major renovations.",
    type: "guide",
    category: "home-safety",
    format: "PDF",
  },
  {
    id: "11",
    title: "Cognitive Wellness Activities",
    description:
      "Collection of brain-healthy activities and exercises to support cognitive function.",
    type: "article",
    category: "wellness",
  },
  {
    id: "12",
    title: "Understanding Medicare and Insurance",
    description:
      "Video guide explaining healthcare coverage options for older adults.",
    type: "video",
    category: "planning",
    duration: "30 min",
  },
  {
    id: "13",
    title: "Managing Chronic Conditions at Home",
    description:
      "Practical strategies for managing common chronic conditions while living independently.",
    type: "article",
    category: "health",
  },
  {
    id: "14",
    title: "Social Engagement Ideas",
    description:
      "Creative ways to stay socially connected and combat isolation while aging in place.",
    type: "article",
    category: "wellness",
  },
  {
    id: "15",
    title: "Caregiver Stress Assessment",
    description:
      "Self-assessment tool to identify caregiver burnout and stress levels.",
    type: "checklist",
    category: "caregiving",
    format: "PDF",
  },
];

function buildLibraryResourcesForDisplay(
  availability: Record<string, boolean> | null,
): Resource[] {
  if (!libraryAssetsUseSupabaseStorage()) {
    return LIBRARY_DEFINITIONS.map((d) => ({
      ...d,
      fileUrl: resolveLibraryFileUrl(d),
      assetCheckPending: false,
    }));
  }

  return LIBRARY_DEFINITIONS.map((d) => {
    const resolved = resolveLibraryFileUrl(d);
    if (!resolved) {
      return { ...d, fileUrl: undefined, assetCheckPending: false };
    }
    if (availability === null) {
      return { ...d, fileUrl: undefined, assetCheckPending: true };
    }
    const ok = availability[d.id] ?? false;
    return { ...d, fileUrl: ok ? resolved : undefined, assetCheckPending: false };
  });
}

const categories = [
  { value: "all", label: "All Resources" },
  { value: "home-safety", label: "Home Safety" },
  { value: "caregiving", label: "Caregiving" },
  { value: "health", label: "Health" },
  { value: "planning", label: "Planning" },
  { value: "wellness", label: "Wellness" },
];

function getTypeIcon(type: ResourceType) {
  switch (type) {
    case "guide":
      return <BookOpen className="h-5 w-5" />;
    case "checklist":
      return <CheckSquare className="h-5 w-5" />;
    case "video":
      return <Video className="h-5 w-5" />;
    case "article":
      return <FileText className="h-5 w-5" />;
  }
}

function getTypeLabel(type: ResourceType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getCategoryColor(category: ResourceCategory) {
  const colors = {
    "home-safety": "bg-blue-100 text-blue-800",
    caregiving: "bg-pink-100 text-pink-800",
    health: "bg-green-100 text-green-800",
    planning: "bg-purple-100 text-purple-800",
    wellness: "bg-orange-100 text-orange-800",
    all: "bg-gray-100 text-gray-800",
  };
  return colors[category];
}

function ResourcePrimaryButton({ resource }: { resource: Resource }) {
  if (resource.assetCheckPending) {
    return (
      <Button variant="outline" className="w-full" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden />
        Checking file…
      </Button>
    );
  }

  const hasFile = Boolean(resource.fileUrl);
  const openStyle =
    resource.type === "video" || resource.type === "article";
  const label = hasFile
    ? resource.type === "video"
      ? "Open video"
      : resource.type === "article"
        ? "Read online"
        : "Download"
    : "Coming soon";
  const Icon = hasFile && openStyle ? ExternalLink : Download;

  if (hasFile && resource.fileUrl) {
    const preferDownload =
      resource.format === "PDF" ||
      resource.type === "checklist" ||
      (resource.type === "guide" && resource.format === "PDF");
    return (
      <Button asChild className="w-full bg-sage-600 hover:bg-sage-700">
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...(preferDownload ? { download: "" } : {})}
        >
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>
        toast.info("This resource is not published yet", {
          description:
            "We are preparing files and links. Contact us if you need this material now.",
        })
      }
    >
      <Download className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}

function LibraryResourceCard({
  resource,
  isSaved,
  onToggleSaved,
}: {
  resource: Resource;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <Card className="border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 text-sage-600">
            {getTypeIcon(resource.type)}
            <span className="text-sm font-medium">{getTypeLabel(resource.type)}</span>
          </div>
          <button
            type="button"
            onClick={onToggleSaved}
            className="text-gray-400 hover:text-sage-600 transition-colors"
            aria-label={isSaved ? "Remove from saved" : "Save resource"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 fill-sage-600 text-sage-600" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </button>
        </div>
        <CardTitle className="text-lg text-gray-900">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{resource.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getCategoryColor(resource.category)}>
            {categories.find((c) => c.value === resource.category)?.label}
          </Badge>
          {resource.format && <Badge variant="outline">{resource.format}</Badge>}
          {resource.duration && <Badge variant="outline">{resource.duration}</Badge>}
        </div>
        <ResourcePrimaryButton resource={resource} />
      </CardContent>
    </Card>
  );
}

export function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ResourceCategory>("all");
  const [savedResources, setSavedResources] = useState<Set<string>>(() => {
    return new Set(loadSavedResourceIds());
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [storageAvailability, setStorageAvailability] = useState<
    Record<string, boolean> | null
  >(() => (libraryAssetsUseSupabaseStorage() ? null : {}));

  useEffect(() => {
    persistSavedResourceIds([...savedResources]);
  }, [savedResources]);

  useEffect(() => {
    if (!libraryAssetsUseSupabaseStorage()) {
      setStorageAvailability({});
      return;
    }

    let cancelled = false;
    (async () => {
      const entries = LIBRARY_DEFINITIONS.flatMap((d) => {
        const url = resolveLibraryFileUrl(d);
        return url ? [{ id: d.id, url }] : [];
      });
      if (entries.length === 0) {
        if (!cancelled) setStorageAvailability({});
        return;
      }
      const pairs = await Promise.all(
        entries.map(async ({ id, url }) => [id, await probeHttpExists(url)] as const),
      );
      if (!cancelled) setStorageAvailability(Object.fromEntries(pairs));
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const libraryResourcesForUi = useMemo(
    () => buildLibraryResourcesForDisplay(storageAvailability),
    [storageAvailability],
  );

  const filteredResources = useMemo(() => {
    let filtered = libraryResourcesForUi;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );
    }

    if (showSavedOnly) {
      filtered = filtered.filter((r) => savedResources.has(r.id));
    }

    return filtered;
  }, [searchQuery, selectedCategory, showSavedOnly, savedResources, libraryResourcesForUi]);

  const toggleSaved = (id: string) => {
    setSavedResources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-sage-50 to-sage-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl mb-6 text-gray-900">Resource Library</h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Browse our comprehensive collection of guides, checklists, videos, and articles to
              support your journey of living in place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as ResourceCategory)}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={showSavedOnly ? "default" : "outline"}
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className={showSavedOnly ? "bg-sage-600 hover:bg-sage-700" : ""}
                >
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Saved ({savedResources.size})
                </Button>
              </div>

              {(searchQuery || selectedCategory !== "all" || showSavedOnly) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: "{searchQuery}"
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                        role="button"
                        aria-label="Clear search"
                      />
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find((c) => c.value === selectedCategory)?.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedCategory("all")}
                        role="button"
                        aria-label="Clear category filter"
                      />
                    </Badge>
                  )}
                  {showSavedOnly && (
                    <Badge variant="secondary" className="gap-1">
                      Saved Only
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setShowSavedOnly(false)}
                        role="button"
                        aria-label="Clear saved-only filter"
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="guide">Guides</TabsTrigger>
              <TabsTrigger value="checklist">Checklists</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredResources.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600">No resources found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <LibraryResourceCard
                      key={resource.id}
                      resource={resource}
                      isSaved={savedResources.has(resource.id)}
                      onToggleSaved={() => toggleSaved(resource.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {(["guide", "checklist", "video", "article"] as ResourceType[]).map((type) => {
              const byType = filteredResources.filter((r) => r.type === type);
              return (
                <TabsContent key={type} value={type} className="space-y-4">
                  {byType.length === 0 ? (
                    <Card className="border-gray-200">
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-600">
                          No {getTypeLabel(type).toLowerCase()} match your filters.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {byType.map((resource) => (
                        <LibraryResourceCard
                          key={resource.id}
                          resource={resource}
                          isSaved={savedResources.has(resource.id)}
                          onToggleSaved={() => toggleSaved(resource.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {savedResources.size > 0 && (
        <section className="py-12 bg-sage-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkCheck className="h-6 w-6 text-sage-600" />
                  Your Saved Resources ({savedResources.size})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  You have {savedResources.size} resource{savedResources.size !== 1 ? "s" : ""}{" "}
                  saved for quick access. Click "Saved" above to view only your saved resources.
                </p>
                <Button
                  onClick={() => setShowSavedOnly(true)}
                  className="bg-sage-600 hover:bg-sage-700"
                >
                  View Saved Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
