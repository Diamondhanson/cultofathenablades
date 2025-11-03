'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    reviews: 0,
    contacts: 0,
    blogPosts: 0,
  });
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadStats();
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
    }
  };

  const loadStats = async () => {
    try {
      const [products, categories, orders, reviews, contacts, blogPosts] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: products.count || 0,
        categories: categories.count || 0,
        orders: orders.count || 0,
        reviews: reviews.count || 0,
        contacts: contacts.count || 0,
        blogPosts: blogPosts.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>⚔️ Cult of Athena</div>
          <div className={styles.logoSubtext}>Admin Dashboard</div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Main</div>
            <Link
              href="/admin/dashboard"
              className={`${styles.navLink} ${pathname === '/admin/dashboard' ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>📊</span>
              <span>Dashboard</span>
            </Link>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Content</div>
            <Link
              href="/admin/dashboard/products"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/products') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>⚔️</span>
              <span>Products</span>
            </Link>
            <Link
              href="/admin/dashboard/categories"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/categories') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>📁</span>
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/dashboard/blog"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/blog') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>📝</span>
              <span>Blog Posts</span>
            </Link>
            <Link
              href="/admin/dashboard/reviews"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/reviews') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>⭐</span>
              <span>Reviews</span>
            </Link>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Sales</div>
            <Link
              href="/admin/dashboard/orders"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/orders') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>🛒</span>
              <span>Orders</span>
            </Link>
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Communication</div>
            <Link
              href="/admin/dashboard/contacts"
              className={`${styles.navLink} ${pathname?.startsWith('/admin/dashboard/contacts') ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>✉️</span>
              <span>Contact Submissions</span>
            </Link>
          </div>
        </nav>

        <button onClick={handleLogout} className={styles.logoutButton}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Dashboard</h1>
            <div className={styles.userInfo}>
              <span>👤</span>
              <span>{userEmail}</span>
            </div>
          </div>
          <p className={styles.subtitle}>Welcome back! Here's what's happening with your store.</p>
        </div>

        <div className={styles.content}>
          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.products}</div>
                  <div className={styles.statLabel}>Total Products</div>
                </div>
                <div className={styles.statIcon}>⚔️</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.categories}</div>
                  <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statIcon}>📁</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.orders}</div>
                  <div className={styles.statLabel}>Total Orders</div>
                </div>
                <div className={styles.statIcon}>🛒</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.reviews}</div>
                  <div className={styles.statLabel}>Reviews</div>
                </div>
                <div className={styles.statIcon}>⭐</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.contacts}</div>
                  <div className={styles.statLabel}>Contact Submissions</div>
                </div>
                <div className={styles.statIcon}>✉️</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div>
                  <div className={styles.statValue}>{stats.blogPosts}</div>
                  <div className={styles.statLabel}>Blog Posts</div>
                </div>
                <div className={styles.statIcon}>📝</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionGrid}>
              <Link href="/admin/dashboard/products/new" className={styles.actionButton}>
                <span className={styles.actionIcon}>➕</span>
                <span>Add Product</span>
              </Link>
              <Link href="/admin/dashboard/categories/new" className={styles.actionButton}>
                <span className={styles.actionIcon}>➕</span>
                <span>Add Category</span>
              </Link>
              <Link href="/admin/dashboard/blog/new" className={styles.actionButton}>
                <span className={styles.actionIcon}>➕</span>
                <span>Write Blog Post</span>
              </Link>
              <Link href="/admin/dashboard/orders" className={styles.actionButton}>
                <span className={styles.actionIcon}>👀</span>
                <span>View Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

