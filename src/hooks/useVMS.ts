import { useState, useEffect } from 'react';
import { Visitor, Appointment, Notification, VisitorStatus, Department, Employee } from '../types';
import { mockAppointments, mockNotifications, mockDepartments, mockEmployees, mockDashboardStats } from '../data/mockData';
import { visitorService } from '../services/visitorService';

export function useVMS() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [departments] = useState<Department[]>(mockDepartments);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [stats, setStats] = useState(mockDashboardStats);

  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [activePassVisitor, setActivePassVisitor] = useState<Visitor | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Load persistent visitors from Database Service on mount
  useEffect(() => {
    visitorService.getVisitors().then((data) => {
      setVisitors(data || []);
    }).catch(() => {
      setVisitors([]);
    });
  }, []);

  // Command palette shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered visitors list
  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.visitorId || v.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hostName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || v.departmentName === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Action methods with database sync
  const addVisitor = async (newVisitorData: Partial<Visitor>) => {
    const created = await visitorService.addVisitor(newVisitorData);
    
    // Refresh visitors list from DB
    const updatedList = await visitorService.getVisitors();
    setVisitors(updatedList);

    // Add activity notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title: 'New Visitor Registered',
      message: `${created.fullName} (${created.company}) checked in for ${created.hostName}.`,
      timestamp: 'Just now',
      category: 'arrival',
      read: false,
      avatar: created.photoUrl,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalVisitorsToday: (prev.totalVisitorsToday || 0) + 1,
      currentlyInside: (prev.currentlyInside || 0) + 1,
    }));

    return created;
  };

  const updateVisitorStatus = async (id: string, newStatus: VisitorStatus) => {
    await visitorService.updateVisitorStatus(id, newStatus);
    const updatedList = await visitorService.getVisitors();
    setVisitors(updatedList);

    if (newStatus === 'CHECKED_OUT') {
      setStats((prev) => ({
        ...prev,
        currentlyInside: Math.max(0, (prev.currentlyInside || 0) - 1),
        completedVisits: (prev.completedVisits || 0) + 1,
      }));
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const openVisitorPass = (visitor: Visitor) => {
    setActivePassVisitor(visitor);
    setIsPassModalOpen(true);
  };

  return {
    visitors: filteredVisitors,
    allVisitors: visitors,
    appointments,
    notifications,
    departments,
    employees,
    stats,
    selectedVisitor,
    setSelectedVisitor,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isPassModalOpen,
    setIsPassModalOpen,
    activePassVisitor,
    openVisitorPass,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    addVisitor,
    updateVisitorStatus,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
