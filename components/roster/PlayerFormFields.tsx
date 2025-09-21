import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { User, Upload } from "lucide-react";
import { positions, playerStatuses } from "@/lib/roster/constants";
import type { PlayerForm } from "@/hooks/use-player-form";

interface PlayerFormFieldsProps {
  formData: PlayerForm;
  onInputChange: (field: keyof PlayerForm, value: string) => void;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  seasonId?: string | null;
}

export function PlayerFormFields({
  formData,
  onInputChange,
  photoPreview,
  onPhotoChange,
  seasonId,
}: PlayerFormFieldsProps) {
  return (
    <>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => onInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => onInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>
            <div>
              <Label htmlFor="gradYear">Graduation Year</Label>
              <Input
                id="gradYear"
                type="number"
                value={formData.gradYear}
                onChange={(e) => onInputChange("gradYear", e.target.value)}
                placeholder="2025"
              />
            </div>
            <div>
              <Label htmlFor="hometown">Hometown</Label>
              <Input
                id="hometown"
                value={formData.hometown}
                onChange={(e) => onInputChange("hometown", e.target.value)}
                placeholder="City, Province"
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => onInputChange("dateOfBirth", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basketball Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basketball Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="jerseyNumber">
                Jersey Number{" "}
                {seasonId && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="jerseyNumber"
                type="number"
                min="0"
                max="99"
                value={formData.jerseyNumber}
                onChange={(e) => onInputChange("jerseyNumber", e.target.value)}
                placeholder=""
              />
              {seasonId && (
                <p className="text-xs text-gray-500 mt-1">
                  Required to add to roster
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="position">Position *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => onInputChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={formData.height}
                onChange={(e) => onInputChange("height", e.target.value)}
                placeholder="6'2&quot;"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => onInputChange("weight", e.target.value)}
                placeholder="180"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo */}
      <Card>
        <CardHeader>
          <CardTitle>Player Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            {photoPreview && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photoPreview}
                  alt="Player photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={onPhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("photo")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                Upload a photo of the player (PNG, JPG, max 5MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>Player Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => onInputChange("bio", e.target.value)}
              placeholder="Player background, achievements, playing style, etc..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Player Status */}
      <Card>
        <CardHeader>
          <CardTitle>Player Status</CardTitle>
          <p className="text-sm text-gray-500">
            {seasonId
              ? "Player status on the current season roster"
              : "Default player status"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="status">Player Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                onInputChange("status", value as PlayerForm["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {playerStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </>
  );
}