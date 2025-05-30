
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Ticket, Car, FileText, CheckCircle, Shield, Star, Wifi, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Validation schemas
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

const flightSchema = z.object({
  flightNumber: z.string().min(3, 'Flight number must be at least 3 characters')
});

const carTransferSchema = z.object({
  pickupAddress: z.string().min(5, 'Please enter a pickup address'),
  dropoffAddress: z.string().min(5, 'Please enter a drop-off address'),
  passengers: z.string().min(1, 'Please select number of passengers'),
  pickupDate: z.string().min(1, 'Please select a pickup date'),
  pickupTime: z.string().min(1, 'Please select a pickup time'),
  carType: z.string().min(1, 'Please select a car type')
});

// API Types based on your response
interface Ancillary {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  metadata?: any;
}

interface RecommendationResponse {
  _id: string;
  customer: any;
  ancillaries: Ancillary[];
  flight: any;
  airline: string;
}

// Dummy data based on your API response
const DUMMY_RECOMMENDATION: RecommendationResponse = {
  "_id": "6839739e62d6013789bb8332",
  "customer": {
    "_id": "6838692fd902ff742d7682f2",
    "email": "jayanth@arcube.com",
    "phone": "7747156225",
    "airline": "66c89890dbbb61d3b420f78e"
  },
  "ancillaries": [
    {
      "_id": "6839739e62d6013789bb8333",
      "id": "681a25de5b03c53d0a0c9f6b",
      "name": "Car Airport Transfer",
      "description": "Arrive in style and convenience with our Car Airport Transfer service. Skip the hassle of finding transportation - we'll take you directly to your destination.",
      "price": 20.7,
      "image": "https://arcube-application.s3.eu-west-1.amazonaws.com/default/Ancillary+Thumbnails+-+New+batch/15%EF%BF%BD+Discount+on+Luxury+Sedan+Hire.png",
      "category": "transportation",
      "metadata": {
        "provider": "mozio",
        "partner_id": "6819d2dbbbc85b6782286d92",
        "source": "partner-other"
      }
    },
    {
      "_id": "6839739e62d6013789bb8334",
      "id": "68384222e5bc478e64f7c976",
      "name": "Baggage Protection",
      "description": "Travel worry-free with our Baggage Protection service! Safeguard your belongings against loss or damage, giving you peace of mind throughout your journey.",
      "price": 6.6,
      "image": "https://arcube-application.s3.eu-west-1.amazonaws.com/default/Ancillary+Thumbnails+-+New+batch/Additional+Carry-On+Bag.png",
      "category": "insurance",
      "metadata": {
        "provider": "blueribbonbags",
        "partner_id": "683840d2611b56bfb8608608",
        "source": "partner-other"
      }
    },
    {
      "_id": "6839739e62d6013789bb8335",
      "id": "68384222e5bc478e64f7c976",
      "name": "GOLD SERVICE",
      "description": "Premium travel insurance with comprehensive coverage. Protect yourself against trip cancellations, medical emergencies, and more.",
      "price": 15.99,
      "image": "https://arcube-application.s3.eu-west-1.amazonaws.com/default/Ancillary+Thumbnails+-+New+batch/Additional+Carry-On+Bag.png",
      "category": "insurance",
      "metadata": {
        "provider": "blueribbonbags",
        "source": "partner-brb"
      }
    },
    {
      "_id": "6839739e62d6013789bb8336",
      "id": "lounge001",
      "name": "Airport Lounge Access",
      "description": "Enjoy premium comfort with access to exclusive airport lounges. Complimentary food, drinks, WiFi and quiet environment.",
      "price": 45.00,
      "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      "category": "comfort",
      "metadata": {
        "provider": "lounge-access",
        "source": "partner-other"
      }
    },
    {
      "_id": "6839739e62d6013789bb8337",
      "id": "wifi001",
      "name": "Premium WiFi",
      "description": "Stay connected with high-speed internet throughout your flight. Stream, work, and browse without interruption.",
      "price": 12.99,
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      "category": "comfort",
      "metadata": {
        "provider": "wifi-provider",
        "source": "partner-other"
      }
    },
    {
      "_id": "6839739e62d6013789bb8338",
      "id": "esim001",
      "name": "Global eSIM Data",
      "description": "Stay connected worldwide with our global eSIM data plans. No roaming charges, instant activation.",
      "price": 24.99,
      "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
      "category": "esim",
      "metadata": {
        "provider": "esim-global",
        "source": "partner-other"
      }
    }
  ],
  "flight": {
    "_id": "66d5cee8c4edab185eb12d5f",
    "flight_number": "BA075",
    "departure_airport": {
      "value": "LOS",
      "label": "Lagos"
    },
    "arrival_airport": {
      "value": "LHR",
      "label": "London Heathrow"
    },
    "arrival_time": "17:00",
    "departure_time": "11:55"
  },
  "airline": "66c89890dbbb61d3b420f78e"
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    flightNumber: '',
    pickupAddress: '',
    dropoffAddress: '',
    passengers: '',
    pickupDate: '',
    pickupTime: '',
    carType: '',
    selectedUpgrades: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateStep = (step: number) => {
    setErrors({});
    try {
      switch (step) {
        case 1:
          emailSchema.parse({ email: formData.email });
          break;
        case 2:
          flightSchema.parse({ flightNumber: formData.flightNumber });
          break;
        case 3:
          carTransferSchema.parse({
            pickupAddress: formData.pickupAddress,
            dropoffAddress: formData.dropoffAddress,
            passengers: formData.passengers,
            pickupDate: formData.pickupDate,
            pickupTime: formData.pickupTime,
            carType: formData.carType
          });
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const fetchRecommendation = async () => {
    setIsLoading(true);
    console.log('Using dummy data for recommendation...');
    
    // Simulate API delay
    setTimeout(() => {
      setRecommendation(DUMMY_RECOMMENDATION);
      setIsLoading(false);
      setCurrentStep(4); // Go to sections overview
      
      toast({
        title: "Recommendations Loaded",
        description: "Found personalized upgrades for your journey!",
      });
    }, 1500);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        setCurrentStep(3); // Go to car transfer details
      } else if (currentStep === 3) {
        fetchRecommendation(); // Fetch recommendations after car transfer details
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleUpgradeToggle = (upgradeId: string) => {
    const newUpgrades = formData.selectedUpgrades.includes(upgradeId)
      ? formData.selectedUpgrades.filter(id => id !== upgradeId)
      : [...formData.selectedUpgrades, upgradeId];
    setFormData({ ...formData, selectedUpgrades: newUpgrades });
  };

  const placeOrder = async () => {
    if (!recommendation || formData.selectedUpgrades.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one upgrade to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('Placing order with dummy data...');
    console.log('Order payload:', {
      recommendation: recommendation._id,
      ancillaries: formData.selectedUpgrades,
      email: formData.email
    });

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Order Confirmed!",
        description: "Your travel upgrades have been successfully booked.",
      });
      setCurrentStep(6); // Go to confirmation
    }, 2000);
  };

  // Group ancillaries by category
  const getCategories = () => {
    if (!recommendation?.ancillaries) return [];
    
    const categories = recommendation.ancillaries.reduce((acc: Record<string, Ancillary[]>, ancillary) => {
      const category = ancillary.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ancillary);
      return acc;
    }, {});
    
    return Object.entries(categories);
  };

  const calculateTotal = () => {
    if (!recommendation?.ancillaries) return 0;
    
    return formData.selectedUpgrades.reduce((total, upgradeId) => {
      const ancillary = recommendation.ancillaries.find(a => a._id === upgradeId);
      return total + (ancillary?.price || 0);
    }, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transportation':
        return <Car className="w-8 h-8 text-blue-600" />;
      case 'insurance':
        return <Shield className="w-8 h-8 text-blue-600" />;
      case 'comfort':
        return <Star className="w-8 h-8 text-blue-600" />;
      case 'esim':
        return <Wifi className="w-8 h-8 text-blue-600" />;
      default:
        return <Star className="w-8 h-8 text-blue-600" />;
    }
  };

  const renderProgressDots = () => {
    const totalSteps = 4;
    const currentStepIndex = Math.min(currentStep - 1, totalSteps - 1);
    
    return (
      <div className="flex justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full mx-1 ${
              i <= currentStepIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Enhance Your Journey</h1>
          {(currentStep >= 4) && (
            <div className="text-sm">
              <span className="mr-4">📧 {formData.email}</span>
              <span>✈️ {formData.flightNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {currentStep < 6 && renderProgressDots()}

        {/* Step 1: Email Capture */}
        {currentStep === 1 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Personalize Your Travel</h2>
              <p className="text-gray-600 text-lg">Enter your email to unlock exclusive upgrades tailored to your journey</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 text-lg border-2 rounded-2xl"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
              
              <Button 
                onClick={handleNext}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Flight Number */}
        {currentStep === 2 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Ticket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Flight Details</h2>
              <p className="text-gray-600 text-lg">Enter your flight number to see available upgrades</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-sm text-gray-500 uppercase tracking-wide">EMAIL</Label>
                <p className="text-gray-800 font-medium">{formData.email}</p>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-purple-600 text-sm mt-1"
                >
                  Change email
                </button>
              </div>

              <div>
                <Label className="text-purple-600 font-medium">Flight Number</Label>
                <Input
                  placeholder="BA075"
                  value={formData.flightNumber}
                  onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value.toUpperCase() })}
                  className="h-14 text-lg border-2 border-purple-300 rounded-2xl mt-2"
                />
                {errors.flightNumber && <p className="text-red-500 text-sm mt-2">{errors.flightNumber}</p>}
              </div>

              <Button 
                onClick={handleNext}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                Continue
              </Button>

              <p className="text-blue-500 text-sm">📄 Example: BA204 or AA1234</p>
            </div>
          </div>
        )}

        {/* Step 3: Car Transfer Details */}
        {currentStep === 3 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Car Transfer Details</h2>
              <p className="text-gray-600">Provide your transfer details for personalized options</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-6">
                <div className="text-center">
                  <span className="block text-gray-500 uppercase tracking-wide">EMAIL</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="text-center">
                  <span className="block text-gray-500 uppercase tracking-wide">FLIGHT</span>
                  <span className="font-medium">{formData.flightNumber}</span>
                </div>
              </div>

              <div>
                <Label className="text-purple-600 font-medium">Pickup Address</Label>
                <Input
                  placeholder="e.g., London Heathrow Airport"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="h-12 rounded-xl mt-2"
                />
                {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
              </div>

              <div>
                <Label className="text-purple-600 font-medium">Drop-off Address</Label>
                <Input
                  placeholder="e.g., Hotel or destination address"
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                  className="h-12 rounded-xl mt-2"
                />
                {errors.dropoffAddress && <p className="text-red-500 text-sm mt-1">{errors.dropoffAddress}</p>}
              </div>

              <div>
                <Label className="text-purple-600 font-medium">Number of Passengers</Label>
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                  className="h-12 rounded-xl mt-2"
                />
                {errors.passengers && <p className="text-red-500 text-sm mt-1">{errors.passengers}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-600 font-medium">Pickup Date</Label>
                  <Input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="h-12 rounded-xl mt-2"
                  />
                  {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
                </div>
                <div>
                  <Label className="text-purple-600 font-medium">Pickup Time</Label>
                  <Input
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                    className="h-12 rounded-xl mt-2"
                  />
                  {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
                </div>
              </div>

              <div>
                <Label className="text-purple-600 font-medium">Car Type</Label>
                <Select value={formData.carType} onValueChange={(value) => setFormData({ ...formData, carType: value })}>
                  <SelectTrigger className="h-12 rounded-xl mt-2">
                    <SelectValue placeholder="Choose car type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                  </SelectContent>
                </Select>
                {errors.carType && <p className="text-red-500 text-sm mt-1">{errors.carType}</p>}
              </div>

              <Button 
                onClick={handleNext}
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                {isLoading ? 'Finding Upgrades...' : 'Find My Upgrades'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Upgrade Sections Overview */}
        {currentStep === 4 && !currentSection && recommendation && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Upgrades</h2>
              <p className="text-gray-600">Select from different categories to enhance your journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {getCategories().map(([category, ancillaries]) => (
                <Card 
                  key={category} 
                  className="p-6 border-2 hover:border-purple-300 transition-colors cursor-pointer"
                  onClick={() => setCurrentSection(category)}
                >
                  <CardContent className="p-0 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{category}</h3>
                    <p className="text-gray-600 text-sm mb-4">{ancillaries.length} item{ancillaries.length !== 1 ? 's' : ''} available</p>
                    <p className="text-purple-600 font-semibold">Explore →</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total Selected</span>
                <p className="text-2xl font-bold text-purple-600">${calculateTotal().toFixed(2)}</p>
              </div>
              <Button 
                onClick={() => setCurrentStep(5)}
                disabled={formData.selectedUpgrades.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl disabled:bg-gray-400"
              >
                Review Order ({formData.selectedUpgrades.length})
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Specific Section Items */}
        {currentStep === 4 && currentSection && recommendation && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <Button 
                onClick={() => setCurrentSection(null)}
                variant="outline"
                className="mb-4 rounded-2xl"
              >
                ← Back to Categories
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{currentSection}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              {recommendation.ancillaries
                .filter(item => item.category === currentSection)
                .map((ancillary) => (
                <Card 
                  key={ancillary._id}
                  className={`p-6 border-2 hover:border-purple-300 transition-colors cursor-pointer ${
                    formData.selectedUpgrades.includes(ancillary._id) ? 'border-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => handleUpgradeToggle(ancillary._id)}
                >
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {ancillary.image ? (
                        <img 
                          src={ancillary.image} 
                          alt={ancillary.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={ancillary.image ? 'hidden' : ''}>
                        {getCategoryIcon(ancillary.category)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2">{ancillary.name}</h3>
                      <p className="text-gray-600 text-sm">{ancillary.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">${ancillary.price.toFixed(2)}</p>
                      {formData.selectedUpgrades.includes(ancillary._id) && (
                        <span className="text-green-600 font-semibold text-sm">✓ Selected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total Selected</span>
                <p className="text-2xl font-bold text-purple-600">${calculateTotal().toFixed(2)}</p>
              </div>
              <Button 
                onClick={() => setCurrentStep(5)}
                disabled={formData.selectedUpgrades.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl disabled:bg-gray-400"
              >
                Review Order ({formData.selectedUpgrades.length})
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Order Review */}
        {currentStep === 5 && recommendation && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="mb-6">
              <Button 
                onClick={() => setCurrentStep(4)}
                variant="outline"
                className="mb-4 rounded-2xl"
              >
                ← Back to Upgrades
              </Button>
              <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>
            </div>

            <div className="space-y-4 mb-8">
              {formData.selectedUpgrades.map(upgradeId => {
                const ancillary = recommendation.ancillaries.find(a => a._id === upgradeId);
                if (!ancillary) return null;
                
                return (
                  <div key={upgradeId} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">{ancillary.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{ancillary.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">${ancillary.price.toFixed(2)}</p>
                      <button 
                        onClick={() => handleUpgradeToggle(upgradeId)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-3xl font-bold text-purple-600">${calculateTotal().toFixed(2)}</span>
              </div>
              
              <Button 
                onClick={placeOrder}
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                {isLoading ? 'Processing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Order Confirmation */}
        {currentStep === 6 && (
          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
              <p className="text-xl opacity-90">Your travel upgrades have been confirmed</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-white/70">Total Amount:</span>
                  <p className="font-semibold">${calculateTotal().toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-white/70">Email:</span>
                  <p className="font-semibold">{formData.email}</p>
                </div>
                <div>
                  <span className="text-white/70">Flight:</span>
                  <p className="font-semibold">{formData.flightNumber}</p>
                </div>
                <div>
                  <span className="text-white/70">Items:</span>
                  <p className="font-semibold">{formData.selectedUpgrades.length} upgrade{formData.selectedUpgrades.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                setCurrentStep(1);
                setCurrentSection(null);
                setRecommendation(null);
                setFormData({
                  email: '',
                  flightNumber: '',
                  pickupAddress: '',
                  dropoffAddress: '',
                  passengers: '',
                  pickupDate: '',
                  pickupTime: '',
                  carType: '',
                  selectedUpgrades: []
                });
              }}
              className="bg-white text-purple-600 hover:bg-gray-100 h-14 px-8 rounded-2xl font-semibold"
            >
              Start New Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
