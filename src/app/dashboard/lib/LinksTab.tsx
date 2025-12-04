import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { CreateLinkRequest, Link } from "@shared/api";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "twitter", label: "Twitter" },
  { id: "website", label: "Website" },
  { id: "email", label: "Email" },
  { id: "spotify", label: "Spotify" },
  { id: "discord", label: "Discord" },
  { id: "custom", label: "Custom Link" },
];

export default function LinksTab() {
  const { links, isLoading, fetchLinks, createLink, updateLink, deleteLink } =
    useLinks();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateLinkRequest>({
    title: "",
    url: "",
    platform: "instagram",
  });

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.url) {
      return;
    }

    try {
      if (editingId) {
        await updateLink.mutateAsync({ id: editingId, updates: formData });
        setEditingId(null);
      } else {
        await createLink.mutateAsync(formData);
      }
      setFormData({ title: "", url: "", platform: "instagram" });
      setShowForm(false);
    } catch (error) {
      // Error handled by useLinks hook
    }
  };

  const handleEdit = (link: Link) => {
    setEditingId(link.id);
    setFormData({
      title: link.title,
      url: link.url,
      platform: link.platform,
    });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteLink.mutateAsync(deleteId);
        setDeleteId(null);
      } catch (error) {
        // Error handled by useLinks hook
      }
    }
  };

  const platformLabel = PLATFORMS.find((p) => p.id === formData.platform)?.label;

  if (isLoading && links.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading links...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Links</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", url: "", platform: "instagram" });
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold">
            {editingId ? "Edit Link" : "Add New Link"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map(({ id, label }) => (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., My YouTube"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  createLink.isPending ||
                  updateLink.isPending
                }
                className="flex-1"
              >
                {isLoading ||
                createLink.isPending ||
                updateLink.isPending
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Add"}{" "}
                Link
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      {links.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground/70">
            {links.length} link{links.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {links.map((link: any) => (
              <div
                key={link.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 group hover:bg-muted/50 transition"
              >
                {/* Drag Handle */}
                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.title}</p>
                  <p className="text-xs text-foreground/60 truncate">
                    {link.url}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {PLATFORMS.find((p) => p.id === link.platform)?.label ||
                      link.platform}
                    • {link.clickCount} clicks
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(link)}
                    className="gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteId(link.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !showForm ? (
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">No links yet</h3>
            <p className="text-sm text-foreground/70">
              Add your first link to get started
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add First Link
          </Button>
        </div>
      ) : null}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be
            undone.
          </DialogDescription>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLink.isPending}
            >
              {deleteLink.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
