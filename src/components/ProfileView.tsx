import { useState } from 'react';
import { UserProfile } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User } from 'lucide-react';

type ProfileViewProps = {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
};

export function ProfileView({ profile, onUpdateProfile }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-orange-600" />
        </div>
        <div>
          <h2>Profile</h2>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <p className="mt-1">{profile.name}</p>
              </div>

              <div>
                <Label>Email</Label>
                <p className="mt-1">{profile.email}</p>
              </div>

              <div>
                <Label>Phone Number</Label>
                <p className="mt-1">{profile.phone}</p>
              </div>

              <div>
                <Label>Delivery Address</Label>
                <p className="mt-1">{profile.address}</p>
              </div>

              <div className="pt-4">
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
