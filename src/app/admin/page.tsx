'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Star,
  Settings,
  ShoppingBag,
  UserPlus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Eye,
  StarOff,
  Check,
  Ban,
  Phone,
  Mail,
  Building2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  FileText,
  Save,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

/* ─── Types ─── */
interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  condition: string;
  price: number | null;
  description: string;
  status: string;
  isFeatured: boolean;
  imageUrl: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  type: string;
  productId: string | null;
  productName: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface SellRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  equipmentType: string;
  manufacturer: string | null;
  model: string | null;
  condition: string;
  description: string | null;
  askingPrice: number | null;
  status: string;
  createdAt: string;
}

interface Review {
  id: string;
  author: string;
  email: string | null;
  rating: number;
  title: string;
  content: string;
  company: string | null;
  role: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count?: { reviews: number };
}

/* ─── Navigation Items ─── */
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'leads', label: 'Leads', icon: FileText },
  { id: 'sell-requests', label: 'Sell Requests', icon: ShoppingBag },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sellRequests, setSellRequests] = useState<SellRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Stats
  const [stats, setStats] = useState({ products: 0, pendingLeads: 0, newReviews: 0, activeSellRequests: 0 });

  // Dialogs
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);
  const [leadDetailOpen, setLeadDetailOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sellDetailOpen, setSellDetailOpen] = useState(false);
  const [selectedSellRequest, setSelectedSellRequest] = useState<SellRequest | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Product form
  const [productForm, setProductForm] = useState({
    name: '', slug: '', category: '', condition: '', price: '', description: '',
    imageUrl: '', status: 'active', isFeatured: false,
  });

  // User form
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' });

  // Filters
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [sellStatusFilter, setSellStatusFilter] = useState('all');

  /* ─── Auth ─── */
  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setIsAuthenticated(true);
        }
      } catch { /* ignore */ }
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem('admin_auth', JSON.stringify(data.user));
        setIsAuthenticated(true);
        toast.success('Welcome back, Admin!');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Connection error. Please try again.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setLoginForm({ email: '', password: '' });
  };

  /* ─── Data Fetching ─── */
  const fetchDashboardData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [productsRes, leadsRes, reviewsRes, sellRes] = await Promise.all([
        fetch('/api/products?limit=100&status=all'),
        fetch('/api/leads?limit=100'),
        fetch('/api/reviews?admin=true&limit=100'),
        fetch('/api/sell-equipment?limit=100'),
      ]);

      const [productsData, leadsData, reviewsData, sellData] = await Promise.all([
        productsRes.json(), leadsRes.json(), reviewsRes.json(), sellRes.json(),
      ]);

      const prods: Product[] = productsData.products || [];
      const lds: Lead[] = leadsData.leads || [];
      const revs: Review[] = reviewsData.reviews || [];
      const sells: SellRequest[] = sellData.requests || [];

      setProducts(prods);
      setLeads(lds);
      setReviews(revs);
      setSellRequests(sells);
      setStats({
        products: prods.length,
        pendingLeads: lds.filter((l: Lead) => l.status === 'new').length,
        newReviews: revs.filter((r: Review) => !r.isApproved).length,
        activeSellRequests: sells.filter((s: SellRequest) => s.status === 'pending').length,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setDataLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch {
      toast.error('Failed to load users');
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (res.ok) setSettings(data.settings || {});
    } catch {
      toast.error('Failed to load settings');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDashboardData();
    fetchUsers();
    fetchSettings();
  }, [isAuthenticated, fetchDashboardData, fetchUsers, fetchSettings]);

  /* ─── Product CRUD ─── */
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        slug: product.slug,
        category: product.category,
        condition: product.condition,
        price: product.price?.toString() || '',
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
        isFeatured: product.isFeatured,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', slug: '', category: '', condition: '', price: '', description: '',
        imageUrl: '', status: 'active', isFeatured: false,
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductSubmit = async () => {
    try {
      const payload = {
        ...productForm,
        price: productForm.price ? parseFloat(productForm.price) : null,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setProductDialogOpen(false);
        fetchDashboardData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Operation failed');
      }
    } catch {
      toast.error('Failed to save product');
    }
  };

  const confirmDelete = (type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      let res;
      if (deleteTarget.type === 'product') {
        res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: 'DELETE' });
      } else if (deleteTarget.type === 'lead') {
        res = await fetch(`/api/admin/leads/${deleteTarget.id}`, { method: 'DELETE' });
      } else if (deleteTarget.type === 'sell-request') {
        res = await fetch(`/api/admin/sell-requests/${deleteTarget.id}`, { method: 'DELETE' });
      } else if (deleteTarget.type === 'review') {
        res = await fetch(`/api/reviews/${deleteTarget.id}`, { method: 'DELETE' });
      } else if (deleteTarget.type === 'user') {
        res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
      }

      if (res && res.ok) {
        toast.success('Deleted successfully');
        fetchDashboardData();
        fetchUsers();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  /* ─── Lead actions ─── */
  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Lead status updated');
        fetchDashboardData();
      } else toast.error('Failed to update lead');
    } catch {
      toast.error('Update failed');
    }
  };

  /* ─── Sell Request actions ─── */
  const updateSellStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/sell-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchDashboardData();
      } else toast.error('Failed to update');
    } catch {
      toast.error('Update failed');
    }
  };

  /* ─── Review actions ─── */
  const toggleReviewApproval = async (review: Review) => {
    try {
      const action = review.isApproved ? 'unapprove' : 'approve';
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, isFeatured: review.isFeatured }),
      });
      if (res.ok) {
        toast.success(`Review ${action === 'approve' ? 'approved' : 'unapproved'}`);
        fetchDashboardData();
      } else toast.error('Failed to update review');
    } catch {
      toast.error('Update failed');
    }
  };

  const toggleReviewFeatured = async (review: Review) => {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', isFeatured: !review.isFeatured }),
      });
      if (res.ok) {
        toast.success('Review featured status toggled');
        fetchDashboardData();
      } else toast.error('Failed to update');
    } catch {
      toast.error('Update failed');
    }
  };

  /* ─── User actions ─── */
  const openUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: 'user' });
    }
    setUserDialogOpen(true);
  };

  const handleUserSubmit = async () => {
    try {
      if (editingUser) {
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        if (res.ok) { toast.success('User updated'); setUserDialogOpen(false); fetchUsers(); }
        else { const d = await res.json(); toast.error(d.error || 'Failed'); }
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userForm),
        });
        if (res.ok) { toast.success('User created'); setUserDialogOpen(false); fetchUsers(); }
        else { const d = await res.json(); toast.error(d.error || 'Failed'); }
      }
    } catch {
      toast.error('Operation failed');
    }
  };

  const toggleUserActive = async (user: User) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) { toast.success('User status updated'); fetchUsers(); }
      else toast.error('Failed to update');
    } catch {
      toast.error('Update failed');
    }
  };

  /* ─── Settings ─── */
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) { toast.success('Settings saved'); }
      else toast.error('Failed to save settings');
    } catch {
      toast.error('Save failed');
    }
  };

  /* ─── Helpers ─── */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      sold: 'bg-red-100 text-red-700 border-red-200',
      reserved: 'bg-amber-100 text-amber-700 border-amber-200',
      new: 'bg-blue-100 text-blue-700 border-blue-200',
      contacted: 'bg-purple-100 text-purple-700 border-purple-200',
      qualified: 'bg-teal-100 text-teal-700 border-teal-200',
      converted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      closed: 'bg-gray-100 text-gray-700 border-gray-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      reviewing: 'bg-blue-100 text-blue-700 border-blue-200',
      offer_made: 'bg-purple-100 text-purple-700 border-purple-200',
      completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      declined: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
    ));
  };

  /* ═══════════════════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════════════════ */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <LayoutDashboard className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Admin Panel</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">PS Medical Devices</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@psmedicaldevices.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loginSubmitting}>
                {loginSubmitting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
   ADMIN LAYOUT
   ═══════════════════════════════════════════════════════ */
  const filteredLeads = leadStatusFilter === 'all' ? leads : leads.filter((l) => l.status === leadStatusFilter);
  const filteredSellRequests = sellStatusFilter === 'all' ? sellRequests : sellRequests.filter((s) => s.status === sellStatusFilter);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary text-primary-foreground transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">PS Medical</h1>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                  {activeTab === item.id && <ChevronRight className="ml-auto h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2.5">
            <p className="text-xs font-medium text-white/80">Admin User</p>
            <p className="text-[11px] text-white/50">admin@psmedicaldevices.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="gap-2">
            <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {dataLoading && activeTab === 'dashboard' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : (
            <>
              {/* ─── DASHBOARD TAB ─── */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Total Products', value: stats.products, icon: Package, color: 'text-primary bg-primary/10', change: '+3 this month' },
                      { label: 'Pending Leads', value: stats.pendingLeads, icon: FileText, color: 'text-amber-600 bg-amber-50', change: 'Needs attention' },
                      { label: 'New Reviews', value: stats.newReviews, icon: Star, color: 'text-teal-600 bg-teal-50', change: 'Awaiting approval' },
                      { label: 'Active Sell Requests', value: stats.activeSellRequests, icon: ShoppingBag, color: 'text-purple-600 bg-purple-50', change: 'In pipeline' },
                    ].map((stat) => (
                      <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                <TrendingUp className="h-3 w-3" />
                                {stat.change}
                              </p>
                            </div>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                              <stat.icon className="h-5 w-5" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Leads & Reviews */}
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700" onClick={() => setActiveTab('leads')}>
                          View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="px-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="pl-6">Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="pr-6">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leads.slice(0, 5).map((lead) => (
                              <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50" onClick={() => { setSelectedLead(lead); setLeadDetailOpen(true); }}>
                                <TableCell className="pl-6 font-medium">{lead.name}</TableCell>
                                <TableCell className="capitalize text-gray-500">{lead.type}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor(lead.status)}`}>
                                    {lead.status}
                                  </span>
                                </TableCell>
                                <TableCell className="pr-6 text-gray-500 text-sm">{formatDate(lead.createdAt)}</TableCell>
                              </TableRow>
                            ))}
                            {leads.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center text-gray-400">No leads yet</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-base font-semibold">Recent Reviews</CardTitle>
                        <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700" onClick={() => setActiveTab('reviews')}>
                          View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="px-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="pl-6">Author</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="pr-6">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reviews.slice(0, 5).map((review) => (
                              <TableRow key={review.id}>
                                <TableCell className="pl-6 font-medium">{review.author}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                                </TableCell>
                                <TableCell>
                                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${review.isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                    {review.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell className="pr-6 text-gray-500 text-sm">{formatDate(review.createdAt)}</TableCell>
                              </TableRow>
                            ))}
                            {reviews.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="py-8 text-center text-gray-400">No reviews yet</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ─── PRODUCTS TAB ─── */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                      <p className="text-sm text-gray-500">{products.length} total products</p>
                    </div>
                    <Button onClick={() => openProductDialog()} className="gap-2 bg-teal-600 hover:bg-teal-700">
                      <Plus className="h-4 w-4" /> Add Product
                    </Button>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="pl-4">Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Condition</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Featured</TableHead>
                              <TableHead className="pr-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="pl-4 font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.condition}</TableCell>
                                <TableCell>{product.price ? `$${product.price.toLocaleString()}` : 'Contact'}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor(product.status)}`}>
                                    {product.status}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {product.isFeatured ? (
                                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">★ Featured</Badge>
                                  ) : (
                                    <span className="text-xs text-gray-400">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="pr-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openProductDialog(product)} title="Edit">
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateSellStatus(product.id, product.status === 'active' ? 'reserved' : 'active')} title="Toggle Status">
                                      <RefreshCw className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleReviewFeatured({ ...product, isApproved: product.isFeatured, isFeatured: product.isFeatured } as unknown as Review)} title="Toggle Featured">
                                      <Star className={`h-3.5 w-3.5 ${product.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => confirmDelete('product', product.id, product.name)} title="Delete">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {products.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400">No products found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ─── LEADS TAB ─── */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
                      <p className="text-sm text-gray-500">{leads.length} total leads</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <Select value={leadStatusFilter} onValueChange={setLeadStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="pl-4">Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="pr-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredLeads.map((lead) => (
                              <TableRow key={lead.id}>
                                <TableCell className="pl-4 font-medium">{lead.name}</TableCell>
                                <TableCell className="text-gray-500">{lead.email}</TableCell>
                                <TableCell className="capitalize">{lead.type}</TableCell>
                                <TableCell className="text-gray-500 max-w-[140px] truncate">{lead.productName || '—'}</TableCell>
                                <TableCell>
                                  <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v)}>
                                    <SelectTrigger className={`h-7 w-[120px] text-xs border ${statusColor(lead.status).split(' ').find(c => c.startsWith('bg-'))} bg-opacity-50`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="qualified">Qualified</SelectItem>
                                      <SelectItem value="converted">Converted</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">{formatDate(lead.createdAt)}</TableCell>
                                <TableCell className="pr-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedLead(lead); setLeadDetailOpen(true); }}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete('lead', lead.id, lead.name)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {filteredLeads.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400">No leads found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ─── SELL REQUESTS TAB ─── */}
              {activeTab === 'sell-requests' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sell Requests</h3>
                      <p className="text-sm text-gray-500">{sellRequests.length} total requests</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <Select value={sellStatusFilter} onValueChange={setSellStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="offer_made">Offer Made</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="pl-4">Name</TableHead>
                              <TableHead>Equipment</TableHead>
                              <TableHead>Condition</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="pr-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSellRequests.map((req) => (
                              <TableRow key={req.id}>
                                <TableCell className="pl-4 font-medium">{req.name}</TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{req.equipmentType}</p>
                                    {req.manufacturer && <p className="text-xs text-gray-400">{req.manufacturer} {req.model || ''}</p>}
                                  </div>
                                </TableCell>
                                <TableCell>{req.condition}</TableCell>
                                <TableCell>{req.askingPrice ? `$${req.askingPrice.toLocaleString()}` : '—'}</TableCell>
                                <TableCell>
                                  <Select value={req.status} onValueChange={(v) => updateSellStatus(req.id, v)}>
                                    <SelectTrigger className="h-7 w-[120px] text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="reviewing">Reviewing</SelectItem>
                                      <SelectItem value="offer_made">Offer Made</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">{formatDate(req.createdAt)}</TableCell>
                                <TableCell className="pr-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedSellRequest(req); setSellDetailOpen(true); }}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete('sell-request', req.id, req.name)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {filteredSellRequests.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400">No sell requests found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ─── REVIEWS TAB ─── */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
                      <p className="text-sm text-gray-500">{reviews.length} total reviews</p>
                    </div>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="pl-4">Author</TableHead>
                              <TableHead>Rating</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Featured</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="pr-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {reviews.map((review) => (
                              <TableRow key={review.id}>
                                <TableCell className="pl-4">
                                  <div>
                                    <p className="font-medium">{review.author}</p>
                                    <p className="text-xs text-gray-400">{review.company || review.email || ''}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-0.5">{renderStars(review.rating)}</div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-gray-700">{review.title}</TableCell>
                                <TableCell>
                                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${review.isApproved ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                                    {review.isApproved ? 'Approved' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${review.isFeatured ? 'text-amber-400' : 'text-gray-300'}`}
                                    onClick={() => toggleReviewFeatured(review)}
                                  >
                                    {review.isFeatured ? <Star className="h-4 w-4 fill-amber-400" /> : <StarOff className="h-4 w-4" />}
                                  </Button>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">{formatDate(review.createdAt)}</TableCell>
                                <TableCell className="pr-4">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className={`h-8 w-8 ${review.isApproved ? 'text-amber-600' : 'text-emerald-600'}`}
                                      onClick={() => toggleReviewApproval(review)}
                                      title={review.isApproved ? 'Unapprove' : 'Approve'}
                                    >
                                      {review.isApproved ? <Ban className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete('review', review.id, review.title)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {reviews.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={7} className="py-12 text-center text-gray-400">No reviews found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ─── USERS TAB ─── */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                      <p className="text-sm text-gray-500">{users.length} total users</p>
                    </div>
                    <Button onClick={() => openUserDialog()} className="gap-2 bg-teal-600 hover:bg-teal-700">
                      <UserPlus className="h-4 w-4" /> Add User
                    </Button>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50/80">
                              <TableHead className="pl-4">Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="pr-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="pl-4 font-medium">{user.name}</TableCell>
                                <TableCell className="text-gray-500">{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-primary text-primary-foreground' : ''}>
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Switch checked={user.isActive} onCheckedChange={() => toggleUserActive(user)} />
                                    <span className={`text-xs font-medium ${user.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                                      {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="pr-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openUserDialog(user)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    {user.email !== 'admin@psmedicaldevices.com' && (
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => confirmDelete('user', user.id, user.name)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {users.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-gray-400">No users found</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ─── SETTINGS TAB ─── */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Site Settings</h3>
                    <p className="text-sm text-gray-500">Manage your website configuration</p>
                  </div>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> General Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input value={settings.company_name || ''} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} placeholder="PS Medical Devices" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tagline</Label>
                          <Input value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} placeholder="Your trusted partner..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="+1 (800) 555-0199" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="info@psmedicaldevices.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="123 Medical Dr, Houston, TX 77001" />
                      </div>
                      <div className="space-y-2">
                        <Label>Business Hours</Label>
                        <Input value={settings.hours || ''} onChange={(e) => setSettings({ ...settings, hours: e.target.value })} placeholder="Monday - Friday, 8:00 AM - 6:00 PM CST" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Palette className="h-4 w-4" /> Color Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Primary Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.primary_color || '#1a2a5e'}
                              onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                              className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-0.5"
                            />
                            <Input value={settings.primary_color || '#1a2a5e'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="flex-1 font-mono text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Accent Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={settings.accent_color || '#0d9488'}
                              onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                              className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-0.5"
                            />
                            <Input value={settings.accent_color || '#0d9488'} onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })} className="flex-1 font-mono text-sm" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button onClick={handleSaveSettings} className="gap-2 bg-teal-600 hover:bg-teal-700">
                    <Save className="h-4 w-4" /> Save Settings
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ═══ DIALOGS ═══ */}

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Name</Label>
                <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} placeholder="Product name" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Slug</Label>
                <Input value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} placeholder="product-slug" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CT Scanner">CT Scanner</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                    <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                    <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                    <SelectItem value="Parts & Accessories">Parts & Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select value={productForm.condition} onValueChange={(v) => setProductForm({ ...productForm, condition: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={productForm.status} onValueChange={(v) => setProductForm({ ...productForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="/images/product.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Product description..." rows={4} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={productForm.isFeatured} onCheckedChange={(v) => setProductForm({ ...productForm, isFeatured: v })} />
              <Label>Featured Product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleProductSubmit} className="bg-teal-600 hover:bg-teal-700">{editingProduct ? 'Update' : 'Create'} Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="user@example.com" disabled={!!editingUser} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={userForm.role} onValueChange={(v) => setUserForm({ ...userForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUserSubmit} className="bg-teal-600 hover:bg-teal-700">{editingUser ? 'Update' : 'Create'} User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Dialog */}
      <Dialog open={leadDetailOpen} onOpenChange={setLeadDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm font-semibold">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <Badge variant="outline" className="mt-0.5 capitalize">{selectedLead.type}</Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                  <p className="text-sm">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                  <p className="text-sm">{selectedLead.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Building2 className="h-3 w-3" /> Company</p>
                  <p className="text-sm">{selectedLead.company || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Date</p>
                  <p className="text-sm">{formatDate(selectedLead.createdAt)}</p>
                </div>
                {selectedLead.productName && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-500">Product</p>
                    <p className="text-sm">{selectedLead.productName}</p>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
                <p className="text-sm bg-gray-50 rounded-lg p-3">{selectedLead.message}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusColor(selectedLead.status)}`}>{selectedLead.status}</span>
                <div className="flex gap-2">
                  {['new', 'contacted', 'qualified', 'converted', 'closed'].filter((s) => s !== selectedLead.status).map((s) => (
                    <Button key={s} variant="outline" size="sm" className="text-xs capitalize" onClick={() => { updateLeadStatus(selectedLead.id, s); setLeadDetailOpen(false); }}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Sell Request Detail Dialog */}
      <Dialog open={sellDetailOpen} onOpenChange={setSellDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sell Request Details</DialogTitle>
          </DialogHeader>
          {selectedSellRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Name</p>
                  <p className="text-sm font-semibold">{selectedSellRequest.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <span className={`inline-flex mt-0.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor(selectedSellRequest.status)}`}>
                    {selectedSellRequest.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</p>
                  <p className="text-sm">{selectedSellRequest.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</p>
                  <p className="text-sm">{selectedSellRequest.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Building2 className="h-3 w-3" /> Company</p>
                  <p className="text-sm">{selectedSellRequest.company || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Date</p>
                  <p className="text-sm">{formatDate(selectedSellRequest.createdAt)}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Equipment Information</p>
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-[11px] text-gray-400">Type</p>
                    <p className="text-sm font-medium">{selectedSellRequest.equipmentType}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Manufacturer</p>
                    <p className="text-sm">{selectedSellRequest.manufacturer || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Model</p>
                    <p className="text-sm">{selectedSellRequest.model || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Condition</p>
                    <p className="text-sm">{selectedSellRequest.condition}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Asking Price</p>
                    <p className="text-sm font-semibold text-teal-600">{selectedSellRequest.askingPrice ? `$${selectedSellRequest.askingPrice.toLocaleString()}` : 'N/A'}</p>
                  </div>
                </div>
              </div>
              {selectedSellRequest.description && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                  <p className="text-sm bg-gray-50 rounded-lg p-3">{selectedSellRequest.description}</p>
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {['pending', 'reviewing', 'offer_made', 'completed', 'declined'].filter((s) => s !== selectedSellRequest.status).map((s) => (
                  <Button key={s} variant="outline" size="sm" className="text-xs capitalize" onClick={() => { updateSellStatus(selectedSellRequest.id, s); setSellDetailOpen(false); }}>
                    {s.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
