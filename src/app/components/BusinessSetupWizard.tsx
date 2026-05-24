import React, { useState } from 'react';
import { BusinessProfileSetup, BusinessInfoData } from './BusinessProfileSetup';
import { ServicePaymentSetup, ServicePaymentData } from './ServicePaymentSetup';
import { LogoBrandingSetup, LogoBrandingData } from './LogoBrandingSetup';
import { storesAPI } from '../services/api';

interface BusinessSetupWizardProps {
  onComplete: () => void;
}

type WizardStep = 1 | 2 | 3;

export function BusinessSetupWizard({ onComplete }: BusinessSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [businessInfoData, setBusinessInfoData] = useState<BusinessInfoData | null>(null);
  const [servicePaymentData, setServicePaymentData] = useState<ServicePaymentData | null>(null);
  const [logoBrandingData, setLogoBrandingData] = useState<LogoBrandingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBusinessInfoContinue = (data: BusinessInfoData) => {
    setBusinessInfoData(data);
    setCurrentStep(2);
  };

  const handleServicePaymentBack = () => {
    setCurrentStep(1);
  };

  const handleServicePaymentContinue = (data: ServicePaymentData) => {
    setServicePaymentData(data);
    setCurrentStep(3);
  };

  const handleLogoBrandingBack = () => {
    setCurrentStep(2);
  };

  const handleLogoBrandingComplete = async (data: LogoBrandingData) => {
    setLogoBrandingData(data);
    
    if (!businessInfoData) {
      console.error('Business info data is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Construct full address from business info
      const fullAddress = `${businessInfoData.streetName} ${businessInfoData.buildingNumber}, ${businessInfoData.zipCode} ${businessInfoData.city}`;
      
      // Save store to backend
      await storesAPI.createStore({
        store_name: businessInfoData.businessName,
        store_address: fullAddress,
      });

      console.log('Store created successfully with setup data:', {
        businessInfo: businessInfoData,
        servicePayment: servicePaymentData,
        logoBranding: data
      });
      
      // Complete the wizard - this will trigger navigation to dashboard
      onComplete();
    } catch (error) {
      console.error('Failed to create store:', error);
      setIsSubmitting(false);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      {currentStep === 1 && (
        <BusinessProfileSetup onContinue={handleBusinessInfoContinue} />
      )}
      
      {currentStep === 2 && (
        <ServicePaymentSetup
          onBack={handleServicePaymentBack}
          onContinue={handleServicePaymentContinue}
        />
      )}
      
      {currentStep === 3 && (
        <LogoBrandingSetup
          onBack={handleLogoBrandingBack}
          onComplete={handleLogoBrandingComplete}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}