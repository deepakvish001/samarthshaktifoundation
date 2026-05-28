/**
 * ADMIN COMPONENT TEMPLATE
 * 
 * This is a template for creating new admin components with standardized
 * real-time functionality. Copy this template when creating new admin components.
 * 
 * Follow these steps:
 * 1. Replace 'YourComponent' with your actual component name
 * 2. Replace 'your_table_name' with the actual database table name
 * 3. Implement your component's specific logic
 * 4. Customize the real-time behavior as needed
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminRealTime } from "@/hooks/useAdminRealTime";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, Plus } from "lucide-react";

const YourComponentContent = () => {
  // Initialize real-time functionality
  const { isConnected, lastEvent } = useAdminRealTime({
    tableName: 'your_table_name', // Replace with your table name
    onInsert: (data) => {
      // Custom logic when new data is inserted
      console.log('New data inserted:', data);
      // You can update local state here if needed
    },
    onUpdate: (data) => {
      // Custom logic when data is updated
      console.log('Data updated:', data);
      // You can update local state here if needed
    },
    onDelete: (data) => {
      // Custom logic when data is deleted
      console.log('Data deleted:', data);
      // You can update local state here if needed
    },
    customMessages: {
      insert: 'Custom insert message',
      update: 'Custom update message', 
      delete: 'Custom delete message'
    }
  });

  // Component state
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    // Define your form fields here
    name: '',
    email: '',
    // ... other fields
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Implement your data loading logic here
        // const { data, error } = await supabase
        //   .from('your_table_name')
        //   .select('*');
        
        // if (error) throw error;
        // setData(data || []);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission (Create/Update)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Implement your create/update logic here
      // const { error } = await supabase
      //   .from('your_table_name')
      //   .insert([formData]);
      
      // if (error) throw error;
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        // ... reset other fields
      });
      
      toast.success('Data saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operation
  const handleDelete = async (id: string) => {
    try {
      // Implement your delete logic here
      // const { error } = await supabase
      //   .from('your_table_name')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      toast.success('Data deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete data');
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      // ... reset other fields
    });
    toast.info('Form reset');
  };

  return (
    <div className="space-y-6">
      {/* Real-time connection status indicator */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Component Title</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Real-time connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email"
              />
            </div>
            
            {/* Add more form fields as needed */}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Display Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Data List</CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {data.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No data available</p>
              ) : (
                // Implement your data display logic here
                <div>
                  {/* Map through your data and display it */}
                  <p>Implement your data display here</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YourComponentContent;
