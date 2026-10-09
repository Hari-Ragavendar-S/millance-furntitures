import { createContext, useContext, useState } from 'react';

const DrawScheduleContext = createContext();

export const useDrawSchedule = () => {
  const context = useContext(DrawScheduleContext);
  if (!context) {
    throw new Error('useDrawSchedule must be used within DrawScheduleProvider');
  }
  return context;
};

export const DrawScheduleProvider = ({ children }) => {
  // Mock draw schedules - in real app, this would come from API
  // Each schedule is uniquely identified by: franchiseId+teamId+groupId+monthId
  const [schedules, setSchedules] = useState([
    {
      id: 'SCH-001',
      franchiseId: 'FRAN-001',
      franchiseName: 'ABC Franchise Salem',
      teamId: 'TEAM-1',
      teamName: 'Team 1',
      groupId: 'GROUP-A',
      groupName: 'Group A',
      monthId: 'MONTH-5',
      monthName: 'Month 5',
      drawDate: '2026-10-05',
      drawTime: '19:00', // 7:00 PM in 24hr format
      timezone: 'Asia/Kolkata',
      participants: 120,
      prize: '32" LED TV',
      prizeValue: '₹75,000',
      status: 'Scheduled', // Scheduled, Upcoming, Live, Completed, Locked, Cancelled
      isLocked: false,
      createdAt: '2026-09-01T10:00:00',
      updatedAt: '2026-09-01T10:00:00'
    },
    {
      id: 'SCH-002',
      franchiseId: 'FRAN-001',
      franchiseName: 'ABC Franchise Salem',
      teamId: 'TEAM-1',
      teamName: 'Team 1',
      groupId: 'GROUP-B',
      groupName: 'Group B',
      monthId: 'MONTH-5',
      monthName: 'Month 5',
      drawDate: '2026-10-06',
      drawTime: '19:30',
      timezone: 'Asia/Kolkata',
      participants: 85,
      prize: 'Washing Machine',
      prizeValue: '₹50,000',
      status: 'Scheduled',
      isLocked: false,
      createdAt: '2026-09-01T10:00:00',
      updatedAt: '2026-09-01T10:00:00'
    },
    {
      id: 'SCH-003',
      franchiseId: 'FRAN-001',
      franchiseName: 'ABC Franchise Salem',
      teamId: 'TEAM-2',
      teamName: 'Team 2',
      groupId: 'GROUP-A',
      groupName: 'Group A',
      monthId: 'MONTH-5',
      monthName: 'Month 5',
      drawDate: '2026-10-05',
      drawTime: '20:00', // 8:00 PM
      timezone: 'Asia/Kolkata',
      participants: 300,
      prize: '43" Smart TV',
      prizeValue: '₹1,50,000',
      status: 'Scheduled',
      isLocked: false,
      createdAt: '2026-09-01T10:00:00',
      updatedAt: '2026-09-01T10:00:00'
    }
  ]);

  // Get schedule for specific franchise+team+group+month
  const getSchedule = (franchiseId, teamId, groupId, monthId) => {
    return schedules.find(
      s => s.franchiseId === franchiseId && 
           s.teamId === teamId && 
           s.groupId === groupId && 
           s.monthId === monthId
    );
  };

  // Get all schedules for a franchise
  const getFranchiseSchedules = (franchiseId) => {
    return schedules.filter(s => s.franchiseId === franchiseId);
  };

  // Get all schedules (admin use)
  const getAllSchedules = (filters = {}) => {
    let filtered = [...schedules];

    if (filters.franchiseId) {
      filtered = filtered.filter(s => s.franchiseId === filters.franchiseId);
    }
    if (filters.teamId) {
      filtered = filtered.filter(s => s.teamId === filters.teamId);
    }
    if (filters.groupId) {
      filtered = filtered.filter(s => s.groupId === filters.groupId);
    }
    if (filters.monthId) {
      filtered = filtered.filter(s => s.monthId === filters.monthId);
    }
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    return filtered;
  };

  // Create or update schedule
  const saveSchedule = (scheduleData) => {
    const {
      franchiseId,
      teamId,
      groupId,
      monthId,
      drawDate,
      drawTime
    } = scheduleData;

    // Check if schedule exists
    const existingIndex = schedules.findIndex(
      s => s.franchiseId === franchiseId && 
           s.teamId === teamId && 
           s.groupId === groupId && 
           s.monthId === monthId
    );

    if (existingIndex >= 0) {
      // Update existing schedule
      const existing = schedules[existingIndex];
      
      // Check if locked
      if (existing.isLocked) {
        return {
          success: false,
          message: 'Draw schedule is locked and cannot be changed.'
        };
      }

      const updated = {
        ...existing,
        drawDate,
        drawTime,
        updatedAt: new Date().toISOString()
      };

      const newSchedules = [...schedules];
      newSchedules[existingIndex] = updated;
      setSchedules(newSchedules);

      return {
        success: true,
        message: 'Schedule updated successfully',
        schedule: updated
      };
    } else {
      // Create new schedule
      const newSchedule = {
        id: `SCH-${Date.now()}`,
        ...scheduleData,
        timezone: 'Asia/Kolkata',
        status: 'Scheduled',
        isLocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setSchedules([...schedules, newSchedule]);

      return {
        success: true,
        message: 'Schedule created successfully',
        schedule: newSchedule
      };
    }
  };

  // Lock schedule (prevent further edits)
  const lockSchedule = (franchiseId, teamId, groupId, monthId) => {
    const index = schedules.findIndex(
      s => s.franchiseId === franchiseId && 
           s.teamId === teamId && 
           s.groupId === groupId && 
           s.monthId === monthId
    );

    if (index >= 0) {
      const newSchedules = [...schedules];
      newSchedules[index] = {
        ...newSchedules[index],
        isLocked: true,
        status: 'Locked'
      };
      setSchedules(newSchedules);
      return { success: true };
    }

    return { success: false };
  };

  // Admin override (with confirmation)
  const adminOverrideSchedule = (scheduleData) => {
    const {
      franchiseId,
      teamId,
      groupId,
      monthId,
      drawDate,
      drawTime
    } = scheduleData;

    const index = schedules.findIndex(
      s => s.franchiseId === franchiseId && 
           s.teamId === teamId && 
           s.groupId === groupId && 
           s.monthId === monthId
    );

    if (index >= 0) {
      const newSchedules = [...schedules];
      newSchedules[index] = {
        ...newSchedules[index],
        drawDate,
        drawTime,
        updatedAt: new Date().toISOString()
      };
      setSchedules(newSchedules);

      return {
        success: true,
        message: 'Schedule overridden by admin',
        schedule: newSchedules[index]
      };
    }

    return {
      success: false,
      message: 'Schedule not found'
    };
  };

  // Calculate time until draw
  const getTimeUntilDraw = (drawDate, drawTime) => {
    const drawDateTime = new Date(`${drawDate}T${drawTime}:00`);
    const now = new Date();
    const diff = drawDateTime - now;

    if (diff <= 0) {
      return null; // Draw has passed
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const value = {
    schedules,
    getSchedule,
    getFranchiseSchedules,
    getAllSchedules,
    saveSchedule,
    lockSchedule,
    adminOverrideSchedule,
    getTimeUntilDraw
  };

  return (
    <DrawScheduleContext.Provider value={value}>
      {children}
    </DrawScheduleContext.Provider>
  );
};

export default DrawScheduleContext;
