"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { updateSite, deleteSite } from "@/lib/services/site-service-client";

interface SiteEditModalProps {
  site: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSite: any) => void;
  onDelete: (siteId: string) => void;
}

export default function SiteEditModal({ site, isOpen, onClose, onUpdate, onDelete }: SiteEditModalProps) {
  const [formData, setFormData] = useState({
    name: site?.name || "",
    address: site?.address || "",
    city: site?.city || "",
    contactName: site?.contact_name || site?.contactName || "",
    contactPhone: site?.contact_phone || site?.contactPhone || "",
    status: site?.status || "active",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.address) {
      setError("Name and address are required");
      return;
    }

    setIsEditing(true);
    setError("");

    try {
      const updatedSite = await updateSite(site.id, {
        name: formData.name,
        address: formData.address,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
      });

      if (updatedSite) {
        onUpdate(updatedSite);
        onClose();
      } else {
        setError("Failed to update site");
      }
    } catch (error) {
      console.error("Error updating site:", error);
      setError("An error occurred while updating the site");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const success = await deleteSite(site.id);
      if (success) {
        onDelete(site.id);
        onClose();
      } else {
        setError("Failed to delete site");
      }
    } catch (error) {
      console.error("Error deleting site:", error);
      setError("An error occurred while deleting the site");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Site
          </DialogTitle>
          <DialogDescription>
            Update site information or delete the site
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter site name"
                disabled={isEditing || isDeleting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
                disabled={isEditing || isDeleting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
              rows={3}
              disabled={isEditing || isDeleting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Contact person name"
                disabled={isEditing || isDeleting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="Contact phone number"
                disabled={isEditing || isDeleting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isEditing || isDeleting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          {/* Current Site Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Current Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site PIN:</span>
                <Badge variant="outline">{site.site_pin || site.pin || 'N/A'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(site.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site ID:</span>
                <span className="font-mono text-xs">{site.id}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isEditing || isDeleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Site
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isEditing || isDeleting}
            >
              Cancel
            </Button>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={isEditing || isDeleting}
            className="w-full sm:w-auto"
          >
            {isEditing ? "Updating..." : "Update Site"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Site
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{site.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span className="text-sm">
                  Deleting this site will also remove all associated shifts, assignments, and employee data.
                </span>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Site"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
