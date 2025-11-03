'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactSubmission } from '@/lib/types/database';
import styles from '../categories/categories.module.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setContacts(contacts.map(c => c.id === id ? { ...c, status: status as any } : c));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div className={styles.page}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Submissions</h1>
      </div>

      <div className={styles.content}>
        {contacts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>✉️</div>
            <h2 className={styles.emptyTitle}>No Submissions Yet</h2>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className={styles.nameCell}>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td style={{ maxWidth: '300px' }}>{contact.message}</td>
                  <td>
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact.id, e.target.value)}
                      style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                  <td>
                    <a href={`mailto:${contact.email}`} className={styles.editButton}>
                      ✉️ Reply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

