import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { CreateAccount } from './components/CreateAccount';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { ShopOwnerDashboard } from './components/ShopOwnerDashboard';
import { BusinessSetupWizard } from './components/BusinessSetupWizard';
import { TechnicianProfileSetup } from './components/TechnicianProfileSetup';
import { PublicHomepage } from './components/PublicHomepage';
import { SimpleTest } from './components/SimpleTest';
import { JoinUsPage } from './components/JoinUsPage';
import { TechnicianApplicationForm } from './components/TechnicianApplicationForm';
import { ShopOwnerApplicationForm } from './components/ShopOwnerApplicationForm';
import { ApplicationSubmitted } from './components/ApplicationSubmitted';
import { PendingApproval } from './components/PendingApproval';
import { MarketplaceLayout } from './components/MarketplaceLayout';
import ServicesPage from './components/ServicesPage';
import TechnicianMarketplace from './components/TechnicianMarketplace';
import TechnicianPublicProfile from './components/TechnicianPublicProfile';
import BookingFlow from './components/BookingFlow';
import PartsMarketplace from './components/PartsMarketplace';
import ProductDetails from './components/ProductDetails';
import CheckoutFlow from './components/CheckoutFlow';
import PreOrderFlow from './components/PreOrderFlow';
import TrackingPage from './components/TrackingPage';
import ShopPage from './components/ShopPage';
import { ContactPage } from './components/ContactPage';
import { WorkspaceLogin } from './components/WorkspaceLogin';
import { CustomerLogin } from './components/CustomerLogin';
import { CustomerCreateAccount } from './components/CustomerCreateAccount';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerOrders } from './components/CustomerOrders';
import { Cart, CartItem } from './components/Cart';
import { CustomerProfile } from './components/CustomerProfile';
import { Toaster } from 'sonner';
import { authAPI, getCurrentUser, getAuthToken, removeAuthToken, adminAPI, storesAPI } from './services/api';
import { rtConnect, rtDisconnect } from './services/realtime';

import { bookingAPI } from './services/api';

export type UserRole = 'technician' | 'shop-owner' | 'customer' | 'admin' | null;

export interface User {
  id?: string | number;
  email: string;
  role: UserRole;
  profileCompleted?: boolean;
  approved?: boolean;
}

type Screen =
  | 'home'
  | 'login'
  | 'create-account'
  | 'customer-login'
  | 'customer-create-account'
  | 'customer-dashboard'
  | 'customer-orders'
  | 'customer-cart'
  | 'customer-profile'
  | 'workspace-login'
  | 'contact'
  | 'join-us'
  | 'technician-application'
  | 'shop-owner-application'
  | 'application-submitted'
  | 'pending-approval'
  | 'dashboard'
  | 'business-setup'
  | 'technician-setup'
  | 'services'
  | 'technician-marketplace'
  | 'technician-profile'
  | 'booking-flow'
  | 'parts-marketplace'
  | 'product-details'
  | 'checkout'
  | 'preorder'
  | 'tracking'
  | 'shop'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-applications';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedShopBrand, setSelectedShopBrand] = useState<string | null>(null);
  const [returnToScreen, setReturnToScreen] = useState<Screen | null>(null);

  // Customer data state
  const [bookings, setBookings] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerProfiles, setCustomerProfiles] = useState<Record<string, any>>({});

  // Application data state
  const [applicationData, setApplicationData] = useState<Record<string, any>>({});

  // Pending applications from backend
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  // Try to restore session from localStorage on mount
  useEffect(() => {
    const token = getAuthToken();
    const savedUser = getCurrentUser();
    if (token && savedUser) {
      const roleMap: Record<string, UserRole> = {
        admin: 'admin',
        customer: 'customer',
        technician: 'technician',
        store_owner: 'shop-owner',
      };
      const mappedRole = roleMap[savedUser.role] || null;
      setCurrentUser({
        email: savedUser.email,
        role: mappedRole,
        profileCompleted: true,
        approved: true,
      });

      // Check URL for screen parameter
      const params = new URLSearchParams(window.location.search);
      const screenParam = params.get('screen') as Screen | null;
      if (screenParam) {
        setCurrentScreen(screenParam);
      }
    }
  }, []);

  // Load pending applications when viewing admin dashboard
  useEffect(() => {
    if (currentUser?.role === 'admin' && (currentScreen === 'admin-dashboard' || currentScreen === 'admin-applications')) {
      loadPendingApplications();
    }
  }, [currentScreen, currentUser]);

  // Verify shop owner has store when accessing dashboard
  useEffect(() => {
    if (currentUser?.role === 'shop-owner' && currentScreen === 'dashboard') {
      const verifyStoreAccess = async () => {
        try {
          const profileCheck = await storesAPI.checkStoreProfile();
          if (!profileCheck.hasProfile) {
            // No store found, redirect to setup
            setCurrentScreen('business-setup');
          }
        } catch (err) {
          // On error, redirect to setup as precaution
          console.warn('Store profile check failed:', err);
          setCurrentScreen('business-setup');
        }
      };
      verifyStoreAccess();
    }
  }, [currentScreen, currentUser]);

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Map backend role to frontend UserRole
      const roleMap: Record<string, UserRole> = {
        admin: 'admin',
        customer: 'customer',
        technician: 'technician',
        store_owner: 'shop-owner',
      };
      const mappedRole = roleMap[response.role] || null;

      const userData: User = {
        id: response.user_id,
        email: email,
        role: mappedRole,
        profileCompleted: true,
        approved: true,
      };
      
      setCurrentUser(userData);
      
      // Connect to real-time updates
      const decoded = JSON.parse(atob(response.token.split('.')[1]));
      const userId = decoded.id;
      rtConnect(userId, mappedRole || 'customer');

      // Route based on role type
      if (mappedRole === 'admin') {
        setCurrentScreen('admin-dashboard');
      } else if (mappedRole === 'customer') {
        if (returnToScreen) {
          setCurrentScreen(returnToScreen);
          setReturnToScreen(null);
        } else {
          setCurrentScreen('customer-dashboard');
        }
      } else if (mappedRole === 'technician' || mappedRole === 'shop-owner') {
        // For professionals, check if they need setup
        if (mappedRole === 'shop-owner') {
          // Check if shop owner has a store profile
          try {
            const profileCheck = await storesAPI.checkStoreProfile();
            if (profileCheck.hasProfile) {
              setCurrentScreen('dashboard');
            } else {
              setCurrentScreen('business-setup');
            }
          } catch (err) {
            // If check fails, default to setup
            setCurrentScreen('business-setup');
          }
        } else {
          // Technician - go to technician dashboard after login
          setCurrentScreen('dashboard');
        }
      }

      return { success: true, message: response.message, token: response.token, role: response.role };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('[APP] Login error:', errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        token: undefined,
        role: undefined,
      };
    }
  };

  const handleRegister = async (email: string, password: string, role: UserRole) => {
    try {
      // Call appropriate backend registration endpoint based on role
      if (role === 'customer') {
        await authAPI.registerCustomer({
          first_name: 'Customer',
          last_name: 'User',
          email,
          password,
          contact_number: '',
          address: '',
        });
      } else if (role === 'technician') {
        await authAPI.registerTechnician({
          first_name: 'Technician',
          last_name: 'User',
          email,
          password,
          contact_number: '',
          specialization: '',
        });
      } else if (role === 'shop-owner') {
        await authAPI.registerStoreOwner({
          first_name: 'Shop',
          last_name: 'Owner',
          email,
          password,
          contact_number: '',
          address: '',
        });
      }

      // Auto-login after registration (only for customers)
      if (role === 'customer') {
        const userData: User = {
          email,
          role: 'customer',
          profileCompleted: false,
          approved: true,
        };
        setCurrentUser(userData);

        // Route to appropriate screen based on role
        if (returnToScreen) {
          setCurrentScreen(returnToScreen);
          setReturnToScreen(null);
        } else {
          setCurrentScreen('customer-dashboard');
        }
      } else {
        // Professionals go to pending-approval
        setCurrentScreen('pending-approval');
      }

      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const handleProfileSetupComplete = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, profileCompleted: true });
      setCurrentScreen('dashboard');
    }
  };

  // Handler for Join Us application completion
  const handleApplicationComplete = (formData: any) => {
    // Store application data by email
    if (formData.email) {
      setApplicationData(prev => ({
        ...prev,
        [formData.email]: {
          ...formData,
          submittedAt: new Date().toISOString(),
          status: 'pending',
        },
      }));
    }
    setCurrentScreen('application-submitted');
  };

  // Admin handlers
  const handleAdminLogin = async (email: string, password: string) => {
    // Try API login first (backend handles all user types including admin)
    try {
      const response = await authAPI.login({ email, password });
      
      // Check if the user is an admin
      if (response.role === 'admin') {
        const user: User = {
          id: response.user_id,
          email: email,
          role: 'admin',
          profileCompleted: true,
          approved: true,
        };
        setCurrentUser(user);
        const decoded = JSON.parse(atob(response.token.split('.')[1]));
        const userId = decoded.id;
        rtConnect(userId, 'admin');
        setCurrentScreen('admin-dashboard');
        return { success: true, message: response.message };
      } else {
        // If login succeeded but user is not admin, log out and return error
        authAPI.logout();
        return { success: false, message: 'Invalid admin credentials' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Admin login failed';
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Invalid admin credentials' 
      };
    }
  };

  const handleApproveApplication = async (email: string) => {
    try {
      // Find the application by email to get the ID and role
      const app = pendingApplications.find((a) => a.email === email);
      if (!app) {
        alert('Application not found');
        return;
      }

      // Call backend approval endpoint based on role
      if (app.role === 'technician') {
        await adminAPI.approveTechnician(app.technician_id);
      } else if (app.role === 'store_owner') {
        await adminAPI.approveStoreOwner(app.store_owner_id);
      }

      // Refresh pending applications
      await loadPendingApplications();
      alert('Application approved! User can now proceed to setup.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to approve application');
    }
  };

  const handleRejectApplication = async (email: string) => {
    try {
      // Find the application by email to get the ID and role
      const app = pendingApplications.find((a) => a.email === email);
      if (!app) {
        alert('Application not found');
        return;
      }

      // Call backend rejection endpoint based on role
      if (app.role === 'technician') {
        await adminAPI.rejectTechnician(app.technician_id);
      } else if (app.role === 'store_owner') {
        await adminAPI.rejectStoreOwner(app.store_owner_id);
      }

      // Refresh pending applications
      await loadPendingApplications();
      alert('Application rejected and user has been removed.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to reject application');
    }
  };

  // Load pending applications from backend
  const loadPendingApplications = async () => {
    try {
      setLoadingApplications(true);
      const technicians = await adminAPI.getPendingTechnicians();
      const storeOwners = await adminAPI.getPendingStoreOwners();
      
      // Combine and format applications
      const allApplications = [
        ...technicians.map((t: any) => ({
          technician_id: t.technician_id,
          email: t.email,
          role: 'technician',
          profileCompleted: !!t.specialization,
        })),
        ...storeOwners.map((s: any) => ({
          store_owner_id: s.store_owner_id,
          email: s.email,
          role: 'store_owner',
          profileCompleted: !!s.store_name,
        })),
      ];
      
      setPendingApplications(allApplications);
    } catch (error) {
      console.error('Failed to load pending applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Customer login for modal
  const handleCustomerLogin = (email: string, password: string) => {
    return handleLogin(email, password, 'customer');
  };

  const handleLogout = () => {
    authAPI.logout();
    rtDisconnect();
    setCurrentUser(null);
    setCurrentScreen('home');
  };

  const handleNavigateToCreateAccount = () => {
    setCurrentScreen('create-account');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToJoinUs = () => {
    setCurrentScreen('join-us');
  };

  const handleNavigateToTechnicianApplication = () => {
    setCurrentScreen('technician-application');
  };

  const handleNavigateToShopOwnerApplication = () => {
    setCurrentScreen('shop-owner-application');
  };

  const handleNavigateToServices = () => {
    setCurrentScreen('services');
  };

  const handleNavigateToTechnicianMarketplace = (category: string) => {
    setSelectedServiceCategory(category);
    setCurrentScreen('technician-marketplace');
  };

  const handleNavigateToTechnicianProfile = (technician: any) => {
    setSelectedTechnician(technician);
    setCurrentScreen('technician-profile');
  };

  const handleNavigateToBookingFlow = (technician: any) => {
    setSelectedTechnician(technician);
    setCurrentScreen('booking-flow');
  };

  const handleNavigateToPartsMarketplace = () => {
    setCurrentScreen('parts-marketplace');
  };

  const handleNavigateToProductDetails = (product: any) => {
    setSelectedProduct(product);
    setCurrentScreen('product-details');
  };

  const handleNavigateToCheckout = (product: any) => {
    setSelectedProduct(product);
    setCurrentScreen('checkout');
  };

  const handleNavigateToPreOrder = (product: any) => {
    setSelectedProduct(product);
    setCurrentScreen('preorder');
  };

  const handleNavigateToTracking = () => {
    setCurrentScreen('tracking');
  };

  const handleNavigateToShop = (brand: string) => {
    setSelectedShopBrand(brand);
    setCurrentScreen('shop');
  };

  const handleNavigateToContact = () => {
    setCurrentScreen('contact');
  };

  const handleNavigateToWorkspaceLogin = () => {
    setCurrentScreen('workspace-login');
  };

  const handleNavigateToCustomerLogin = () => {
    setCurrentScreen('customer-login');
  };

  const handleNavigateToCustomerCreateAccount = () => {
    setCurrentScreen('customer-create-account');
  };

  const handleNavigateToAdminLogin = () => {
    setCurrentScreen('admin-login');
  };

  const handleNavigateToOrders = () => {
    setCurrentScreen('customer-orders');
  };

  const handleNavigateToCart = () => {
    setCurrentScreen('customer-cart');
  };

  const handleNavigateToProfile = () => {
    setCurrentScreen('customer-profile');
  };

  // Booking handlers
  const handleBookingComplete = (bookingData: any) => {
    setBookings((prev) => [...prev, bookingData]);
  };

  // Cart handlers
  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleCartCheckout = () => {
    // For now, just navigate to a success screen or clear cart
    // In a real app, this would process the order
    alert('Checkout functionality would process the order here');
  };

  // Profile handlers
  const handleSaveProfile = (profileData: any) => {
    if (currentUser?.email) {
      setCustomerProfiles((prev) => ({
        ...prev,
        [currentUser.email]: profileData,
      }));
    }
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    // In a real app, this would validate and update the password
    // For now, we just show a success message (handled in the component)
  };

  // Render home page directly without complex conditionals
  if (currentScreen === 'home') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="home"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <PublicHomepage
          onNavigateToServices={handleNavigateToServices}
          onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
          onNavigateToJoinUs={handleNavigateToJoinUs}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'services') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="services"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <ServicesPage
          onSelectCategory={handleNavigateToTechnicianMarketplace}
          onBack={handleNavigateToHome}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'parts-marketplace') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <PartsMarketplace
          onSelectProduct={handleNavigateToProductDetails}
          onBack={handleNavigateToHome}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'contact') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="contact"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <ContactPage onBack={handleNavigateToHome} />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'workspace-login') {
    return (
      <WorkspaceLogin
        onLogin={handleLogin}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToJoinUs={handleNavigateToJoinUs}
      />
    );
  }

  // Customer Login
  if (currentScreen === 'customer-login') {
    return (
      <CustomerLogin
        onLogin={(email, password) => handleLogin(email, password, 'customer')}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToJoinUs={handleNavigateToJoinUs}
      />
    );
  }

  // Customer Create Account
  if (currentScreen === 'customer-create-account') {
    return (
      <CustomerCreateAccount
        onRegister={(email, password) => handleRegister(email, password, 'customer')}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
      />
    );
  }

  // Customer Dashboard
  if (currentScreen === 'customer-dashboard' && currentUser && currentUser.role === 'customer') {
    return (
      <CustomerDashboard
        userEmail={currentUser.email}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onLogout={handleLogout}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      />
    );
  }

  // Customer Orders
  if (currentScreen === 'customer-orders' && currentUser && currentUser.role === 'customer') {
    const userBookings = bookings.filter(b => b.userEmail === currentUser.email);
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="services"
        isLoggedIn={true}
        userEmail={currentUser.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <CustomerOrders
          userEmail={currentUser.email}
          bookings={userBookings}
          onNavigateToServices={handleNavigateToServices}
        />
      </MarketplaceLayout>
    );
  }

  // Customer Cart
  if (currentScreen === 'customer-cart' && currentUser && currentUser.role === 'customer') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={true}
        userEmail={currentUser.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <Cart
          userEmail={currentUser.email}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onCheckout={handleCartCheckout}
          onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        />
      </MarketplaceLayout>
    );
  }

  // Customer Profile
  if (currentScreen === 'customer-profile' && currentUser && currentUser.role === 'customer') {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="home"
        isLoggedIn={true}
        userEmail={currentUser.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <CustomerProfile
          userEmail={currentUser.email}
          profileData={customerProfiles[currentUser.email]}
          onSaveProfile={handleSaveProfile}
          onChangePassword={handleChangePassword}
        />
      </MarketplaceLayout>
    );
  }

  // Join Us - Standalone Application Page (NO MarketplaceLayout)
  if (currentScreen === 'join-us') {
    return (
      <JoinUsPage
        onNavigateToTechnicianApplication={handleNavigateToTechnicianApplication}
        onNavigateToShopOwnerApplication={handleNavigateToShopOwnerApplication}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToAdminLogin={handleNavigateToAdminLogin}
      />
    );
  }

  if (currentScreen === 'technician-application') {
    return (
      <TechnicianApplicationForm
        onComplete={handleApplicationComplete}
        onBack={handleNavigateToJoinUs}
      />
    );
  }

  if (currentScreen === 'shop-owner-application') {
    return (
      <ShopOwnerApplicationForm
        onComplete={handleApplicationComplete}
        onBack={handleNavigateToJoinUs}
      />
    );
  }

  if (currentScreen === 'application-submitted') {
    return (
      <ApplicationSubmitted onNavigateToHome={handleNavigateToHome} />
    );
  }

  if (currentScreen === 'technician-marketplace' && selectedServiceCategory) {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="services"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <TechnicianMarketplace
          category={selectedServiceCategory}
          onSelectTechnician={handleNavigateToTechnicianProfile}
          onBookNow={handleNavigateToBookingFlow}
          onBack={() => setCurrentScreen('services')}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'technician-profile' && selectedTechnician) {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="services"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <TechnicianPublicProfile
          technician={selectedTechnician}
          onBookNow={handleNavigateToBookingFlow}
          onBack={() => setCurrentScreen('technician-marketplace')}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'booking-flow' && selectedTechnician) {
    // Check if user is authenticated as customer
    if (!currentUser || currentUser.role !== 'customer') {
      setReturnToScreen('booking-flow');
      setCurrentScreen('customer-login');
      return null;
    }

    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="services"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <BookingFlow
          technician={selectedTechnician}
          onBack={() => setCurrentScreen('technician-profile')}
          onBookingComplete={handleBookingComplete}
          userEmail={currentUser?.email}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'product-details' && selectedProduct) {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <ProductDetails
          product={selectedProduct}
          onBuyNow={handleNavigateToCheckout}
          onPreOrder={handleNavigateToPreOrder}
          onBack={() => setCurrentScreen('parts-marketplace')}
          onViewShop={handleNavigateToShop}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'checkout' && selectedProduct) {
    // Check if user is authenticated as customer
    if (!currentUser || currentUser.role !== 'customer') {
      setReturnToScreen('checkout');
      setCurrentScreen('customer-login');
      return null;
    }

    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <CheckoutFlow
          product={selectedProduct}
          onBack={() => setCurrentScreen('product-details')}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'preorder' && selectedProduct) {
    // Check if user is authenticated as customer
    if (!currentUser || currentUser.role !== 'customer') {
      setReturnToScreen('preorder');
      setCurrentScreen('customer-login');
      return null;
    }

    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <PreOrderFlow
          product={selectedProduct}
          onBack={() => setCurrentScreen('product-details')}
        />
      </MarketplaceLayout>
    );
  }

  if (currentScreen === 'shop' && selectedShopBrand) {
    return (
      <MarketplaceLayout
        onNavigateToHome={handleNavigateToHome}
        onNavigateToServices={handleNavigateToServices}
        onNavigateToPartsMarketplace={handleNavigateToPartsMarketplace}
        onNavigateToLogin={handleNavigateToWorkspaceLogin}
        onNavigateToJoinUs={handleNavigateToJoinUs}
        onNavigateToContact={handleNavigateToContact}
        onLogin={handleCustomerLogin}
        onNavigateToCreateAccount={handleNavigateToCustomerCreateAccount}
        onNavigateToAdminLogin={() => setCurrentScreen('admin-login')}
        currentPage="parts"
        isLoggedIn={currentUser?.role === 'customer'}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
        onNavigateToOrders={handleNavigateToOrders}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToProfile={handleNavigateToProfile}
      >
        <ShopPage
          brand={selectedShopBrand}
          onBack={() => setCurrentScreen('product-details')}
          onSelectProduct={handleNavigateToProductDetails}
        />
      </MarketplaceLayout>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Pending Approval Screen */}
        {currentScreen === 'pending-approval' && currentUser && (
        <PendingApproval
          userRole={currentUser.role as 'technician' | 'shop-owner'}
          onLogout={handleLogout}
          onNavigateToHome={handleNavigateToHome}
        />
      )}

      {/* Existing Login Page */}
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} onNavigateToCreateAccount={handleNavigateToCreateAccount} />
      )}

      {/* Existing Create Account Page */}
      {currentScreen === 'create-account' && (
        <CreateAccount onRegister={handleRegister} onNavigateToLogin={handleNavigateToLogin} />
      )}

      {/* Existing Profile Setup Wizards */}
      {currentScreen === 'business-setup' && <BusinessSetupWizard onComplete={handleProfileSetupComplete} />}

      {currentScreen === 'technician-setup' && <TechnicianProfileSetup onComplete={handleProfileSetupComplete} />}

      {/* Existing Dashboards */}
      {currentScreen === 'dashboard' && currentUser && (
        <>
          {currentUser.role === 'technician' && <TechnicianDashboard user={currentUser} onLogout={handleLogout} customerBookings={bookings} />}
          {currentUser.role === 'shop-owner' && <ShopOwnerDashboard user={currentUser} onLogout={handleLogout} />}
        </>
      )}

      {/* Tracking - Only accessible after login, will be added to customer dashboard later */}
      {currentScreen === 'tracking' && currentUser && (
        <TrackingPage onBack={handleNavigateToHome} />
      )}

      {/* Admin Login */}
      {currentScreen === 'admin-login' && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {/* Admin Dashboard - Protected route */}
      {(currentScreen === 'admin-dashboard' || currentScreen === 'admin-applications') && currentUser && currentUser.role === 'admin' && (
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          pendingApplications={pendingApplications.map((a) => ({
            email: a.email,
            role: a.role === 'technician' ? 'technician' : 'shop-owner',
            profileCompleted: a.profileCompleted,
          }))}
          onApproveApplication={handleApproveApplication}
          onRejectApplication={handleRejectApplication}
          initialTab={currentScreen === 'admin-applications' ? 'applications' : 'dashboard'}
          applicationData={applicationData}
        />
      )}
      </div>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;