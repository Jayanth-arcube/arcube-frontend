
import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Ticket, Car, FileText, CheckCircle, Shield, Star } from 'lucide-react';
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

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    flightNumber: '',
    wantsCarTransfer: null as boolean | null,
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
        case 4:
          if (formData.wantsCarTransfer) {
            carTransferSchema.parse({
              pickupAddress: formData.pickupAddress,
              dropoffAddress: formData.dropoffAddress,
              passengers: formData.passengers,
              pickupDate: formData.pickupDate,
              pickupTime: formData.pickupTime,
              carType: formData.carType
            });
          }
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCarTransferDecision = (wants: boolean) => {
    setFormData({ ...formData, wantsCarTransfer: wants });
    if (wants) {
      setCurrentStep(4);
    } else {
      setCurrentStep(5);
    }
  };

  const handleUpgradeToggle = (upgradeId: string) => {
    const newUpgrades = formData.selectedUpgrades.includes(upgradeId)
      ? formData.selectedUpgrades.filter(id => id !== upgradeId)
      : [...formData.selectedUpgrades, upgradeId];
    setFormData({ ...formData, selectedUpgrades: newUpgrades });
  };

  const completeOrder = () => {
    toast({
      title: "Order Confirmed!",
      description: "Your travel upgrades have been successfully booked.",
    });
    setCurrentStep(8);
  };

  const renderProgressDots = () => {
    const totalSteps = 8;
    return (
      <div className="flex justify-center mb-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full mx-1 ${
              i < Math.min(currentStep - 1, 2) ? 'bg-white' : 'bg-white/30'
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
          {(currentStep === 5 || currentStep === 6) && (
            <div className="text-sm">
              <span className="mr-4">📧 {formData.email}</span>
              <span>✈️ {formData.flightNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {currentStep < 8 && renderProgressDots()}

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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Almost There!</h2>
              <p className="text-gray-600 text-lg">Enter your flight number to see available upgrades</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-sm text-gray-500 uppercase tracking-wide">EMAIL</Label>
                <p className="text-gray-800 font-medium">{formData.email}</p>
                <button className="text-purple-600 text-sm mt-1">Change email</button>
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
                Find My Upgrades
              </Button>

              <p className="text-blue-500 text-sm">📄 Example: BA204 or AA1234</p>
            </div>
          </div>
        )}

        {/* Step 3: Car Transfer Decision */}
        {currentStep === 3 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Book a Car Transfer?</h2>
              <p className="text-gray-600 text-lg">Arrive in style and comfort. Let us arrange a transfer for you.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <div>
                  <span className="block text-gray-500 uppercase tracking-wide">EMAIL</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div>
                  <span className="block text-gray-500 uppercase tracking-wide">FLIGHT</span>
                  <span className="font-medium">{formData.flightNumber}</span>
                </div>
              </div>
              <div className="text-center space-x-2">
                <button className="text-purple-600 text-sm">Change email</button>
                <button className="text-purple-600 text-sm">Change flight</button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={() => handleCarTransferDecision(true)}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                Yes, Please!
              </Button>
              <Button 
                onClick={() => handleCarTransferDecision(false)}
                variant="outline"
                className="flex-1 h-14 text-lg border-2 rounded-2xl"
              >
                No, Thanks
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Car Transfer Details */}
        {currentStep === 4 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Car Transfer Details</h2>
              <p className="text-gray-600">Please provide the details for your car transfer</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-6">
                <div className="text-center">
                  <span className="block text-gray-500 uppercase tracking-wide">EMAIL</span>
                  <span className="font-medium">{formData.email}</span>
                  <button className="block text-purple-600 text-sm mt-1">Change email</button>
                </div>
                <div className="text-center">
                  <span className="block text-gray-500 uppercase tracking-wide">FLIGHT</span>
                  <span className="font-medium">{formData.flightNumber}</span>
                  <button className="block text-purple-600 text-sm mt-1">Change flight</button>
                </div>
              </div>

              <div>
                <Input
                  placeholder="Pickup Address (e.g., Airport)"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="h-12 rounded-xl"
                />
                {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
              </div>

              <div>
                <Input
                  placeholder="Drop-off Address"
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                  className="h-12 rounded-xl"
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
                <Select value={formData.carType} onValueChange={(value) => setFormData({ ...formData, carType: value })}>
                  <SelectTrigger className="h-12 rounded-xl">
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
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 rounded-2xl"
              >
                Confirm Transfer Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Upgrade Categories */}
        {currentStep === 5 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="text-purple-600 font-semibold mb-2">esim</h3>
                <p className="text-gray-500 text-sm">5 items</p>
              </div>
              <div className="text-center">
                <h3 className="text-purple-600 font-semibold mb-2">insurance</h3>
                <p className="text-gray-500 text-sm">2 items</p>
              </div>
              <div className="text-center">
                <h3 className="text-purple-600 font-semibold mb-2">transportation</h3>
                <p className="text-gray-500 text-sm">1 item</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total</span>
                <p className="text-2xl font-bold text-purple-600">$0.00</p>
              </div>
              <Button 
                onClick={() => setCurrentStep(6)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-2xl"
              >
                Complete Order
              </Button>
            </div>
          </div>
        )}

        {/* Step 6: Specific Upgrades */}
        {currentStep === 6 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <Button 
              onClick={() => setCurrentStep(5)}
              variant="outline"
              className="mb-6 rounded-2xl"
            >
              ← Back to Categories
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border-2 hover:border-purple-300 transition-colors cursor-pointer" onClick={() => handleUpgradeToggle('baggage')}>
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Baggage Protection</h3>
                  <p className="text-gray-600 text-sm mb-4">Travel worry-free with our Baggage Protection service! Safeguard your belongings against loss or damage, giving you peace of mind throughout your journey.</p>
                  <p className="text-2xl font-bold text-purple-600">$6.50</p>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 hover:border-purple-300 transition-colors cursor-pointer" onClick={() => handleUpgradeToggle('gold')}>
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">GOLD SERVICE</h3>
                  <p className="text-gray-600 text-sm mb-4">Travel worry-free with our Baggage Protection service! Safeguard your belongings against loss or damage, giving you peace of mind throughout your journey.</p>
                  <p className="text-2xl font-bold text-purple-600">$5.00</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total</span>
                <p className="text-2xl font-bold text-purple-600">$0.00</p>
              </div>
              <Button 
                onClick={() => setCurrentStep(7)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-2xl"
              >
                Complete Order
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Order Processing */}
        {currentStep === 7 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your order...</p>
            {setTimeout(() => completeOrder(), 2000)}
          </div>
        )}

        {/* Step 8: Order Confirmation */}
        {currentStep === 8 && (
          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
              <p className="text-xl opacity-90">Your travel upgrades have been confirmed</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-white/70">Order #:</span>
                  <p className="font-semibold">Order placed successfully</p>
                </div>
                <div>
                  <span className="text-white/70">Email:</span>
                  <p className="font-semibold">{formData.email}</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  email: '',
                  flightNumber: '',
                  wantsCarTransfer: null,
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
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
