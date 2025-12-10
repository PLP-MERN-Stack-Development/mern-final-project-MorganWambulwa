import { useState } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CreateDonationForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    foodType: "Cooked Meal",
    quantity: "",
    pickupLocation: "",
    bestBefore: "", 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- FIX STARTS HERE ---
    // Create a copy of the data to clean it
    const payload = { ...formData };

    // If bestBefore is an empty string, remove it entirely
    if (!payload.bestBefore) {
      delete payload.bestBefore;
    }
    // --- FIX ENDS HERE ---

    try {
      await api.post('/donations', payload);
      toast.success("Donation Created Successfully!");
      
      // Reset form
      setFormData({
        title: "", description: "", foodType: "Cooked Meal", quantity: "", 
        pickupLocation: "", bestBefore: ""
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Submission Error:", error);
      // Now displays the actual error from the server
      const errorMessage = error.response?.data?.message || "Failed to create donation";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            placeholder="e.g. 50 Lunch Boxes" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foodType">Food Type *</Label>
          <Select 
            value={formData.foodType} 
            onValueChange={value => setFormData({...formData, foodType: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cooked Meal">Cooked Meal</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Canned Goods">Canned Goods</SelectItem>
              <SelectItem value="Baked Goods">Baked Goods</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="Describe the food, packaging, and any special instructions..." 
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input 
            id="quantity" 
            value={formData.quantity} 
            onChange={e => setFormData({...formData, quantity: e.target.value})} 
            placeholder="e.g. 10kg or 20 boxes" 
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Pickup Location *</Label>
          <Input 
            id="location" 
            value={formData.pickupLocation} 
            onChange={e => setFormData({...formData, pickupLocation: e.target.value})} 
            placeholder="Street Address, City" 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiry">Best Before (Optional)</Label>
        <Input 
          id="expiry" 
          type="datetime-local" 
          value={formData.bestBefore} 
          onChange={e => setFormData({...formData, bestBefore: e.target.value})} 
        />
        <p className="text-xs text-muted-foreground">Leave blank if not applicable</p>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
        {loading ? "Posting..." : "Post Donation"}
      </Button>
    </form>
  );
};

export default CreateDonationForm;