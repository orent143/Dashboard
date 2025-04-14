<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">☰</button>
        <div class="logo">
          <span class="logo-text">JRU</span>
        </div>
      </div>
      <div class="header-right">
        <div class="profile">
          <div class="notification-wrapper">
            <i class="pi pi-bell notification-icon" @click="toggleNotifications"></i>
            <span v-if="unreadNotifications.length > 0" class="notification-badge">{{ unreadNotifications.length }}</span>
            
            <div v-if="showNotifications" class="notification-dropdown">
              <div class="notification-header">
                <h3>Notifications</h3>
                <span v-if="notifications.length > 0" class="mark-all-read" @click="markAllAsRead">
                  Mark all as read
                </span>
              </div>
              
              <div v-if="notifications.length === 0" class="empty-notifications">
                No notifications at this time
              </div>
              
              <div v-else class="notification-list">
                <div 
                  v-for="(notification, index) in notifications" 
                  :key="index" 
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="notification-icon-wrapper" :class="notification.type">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ formatNotificationTime(notification.time) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="profile-dropdown" @click="toggleProfileModal">
            <i class="pi pi-user profile-icon"></i>
            <span class="user-name">{{ user?.name || 'User' }}</span>
          </div>
        </div>
      </div>
    </div>

    <ProfileModal 
      v-if="isProfileModalOpen" 
      :user="user" 
      :isProfileModalOpen="isProfileModalOpen"
      @close="toggleProfileModal" 
    />
  </header>
</template>

<script>
import ProfileModal from "@/views/Profile.vue";

export default {
  components: { ProfileModal },
  data() {
    return {
      user: {
        name: "Michael Admin",
        role: "admin",
        user_id: "12345",
        email: "admin.mike@example.com",
      },
      isProfileModalOpen: false,
      showNotifications: false,
      notifications: [
        {
          id: 1,
          title: "Upcoming Event: Seminar on Web Development",
          message: "Join us for an exciting seminar on Web Development. Date: 25th April 2025.",
          time: new Date().toISOString(),
          read: false,
          type: "event",
        },
        {
          id: 2,
          title: "New Assignment in Math",
          message: "You have a new assignment posted in Math 101. Due date: 27th April 2025.",
          time: new Date().toISOString(),
          read: false,
          type: "assignment",
        },
      ],
      lastChecked: null,
    };
  },
  computed: {
    unreadNotifications() {
      return this.notifications.filter(notification => !notification.read);
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    toggleProfileModal() {
      this.isProfileModalOpen = !this.isProfileModalOpen;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (!this.showNotifications) {
        this.lastChecked = new Date();
        localStorage.setItem('lastNotificationCheck', this.lastChecked.toISOString());
      }
    },
    getNotificationIcon(type) {
      const iconMap = {
        'event': 'pi pi-calendar',
        'assignment': 'pi pi-file',
        'quiz': 'pi pi-list',
        'exam': 'pi pi-exclamation-triangle',
        'class': 'pi pi-clock',
        'system': 'pi pi-info-circle'
      };
      return iconMap[type] || 'pi pi-bell';
    },
    formatNotificationTime(time) {
      const date = new Date(time);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    },
    markAllAsRead() {
      this.notifications = this.notifications.map(notification => ({
        ...notification,
        read: true
      }));

      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    handleNotificationClick(notification) {
      notification.read = true;

      localStorage.setItem('notifications', JSON.stringify(this.notifications));

      // Handle click on the notification to redirect to appropriate page
      if (notification.type === 'event') {
        this.$router.push('/student/events');
      } else if (notification.type === 'assignment') {
        this.$router.push('/student/assignments');
      }

      this.showNotifications = false;
    }
  },
  mounted() {
    // Simulate fetching user data and notifications
    const userData = localStorage.getItem("user");
    if (userData) {
      this.user = JSON.parse(userData);
    }

    // Add simulated notifications
    if (this.notifications.length === 0) {
      this.notifications.push({
        id: 1,
        title: "Welcome to the Student Dashboard",
        message: "You can view your courses and assignments here.",
        time: new Date().toISOString(),
        read: false,
        type: "system"
      });
    }
  }
};
</script>

  <style scoped>
  .dashboard-header {
    position: sticky;
    top: 0;
    background-color: #D9D9D9;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .sidebar-toggle {
    color: rgba(0, 0, 0, 0.932);
    background-color: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
    font-size: 25px;
    font-weight: 900;
    transition: background-color 0.3s;
  }
  
  .sidebar-toggle:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    margin-left: 10px;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 16px;
    pointer-events: none;
  }
  
  .search-bar input {
    padding: 8px 12px 8px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 200px;
    font-size: 14px;
    color: #333;
    background-color: #F5F5F5;
    transition: all 0.3s ease;
  }
  
  .search-bar input:focus {
    border-color: #007BF6;
    background-color: white;
    box-shadow: 0 0 0 2px rgba(0, 123, 246, 0.1);
    outline: none;
  }
  
  .profile {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .notification-wrapper {
    position: relative;
  }
  
  .notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #dc3545;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .notification-dropdown {
    position: absolute;
    top: 100%;
    right: -100px;
    width: 300px;
    max-height: 400px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    z-index: 100;
    overflow: hidden;
    margin-top: 10px;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .notification-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
  
  .mark-all-read {
    font-size: 12px;
    color: #007BF6;
    cursor: pointer;
  }
  
  .mark-all-read:hover {
    text-decoration: underline;
  }
  
  .empty-notifications {
    padding: 20px;
    text-align: center;
    color: #6c757d;
  }
  
  .notification-list {
    overflow-y: auto;
    max-height: 350px;
  }
  
  .notification-item {
    display: flex;
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .notification-item:hover {
    background-color: #f8f9fa;
  }
  
  .notification-item.unread {
    background-color: #f0f7ff;
  }
  
  .notification-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  
  .notification-icon-wrapper.class {
    background-color: #cce5ff;
  }
  
  .notification-icon-wrapper.class i {
    color: #007BF6;
  }
  
  .notification-icon-wrapper.assignment {
    background-color: #d4edda;
  }
  
  .notification-icon-wrapper.assignment i {
    color: #28a745;
  }
  
  .notification-icon-wrapper.quiz, .notification-icon-wrapper.exam {
    background-color: #fff3cd;
  }
  
  .notification-icon-wrapper.quiz i, .notification-icon-wrapper.exam i {
    color: #fd7e14;
  }
  
  .notification-icon-wrapper.system {
    background-color: #f8d7da;
  }
  
  .notification-icon-wrapper.system i {
    color: #dc3545;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  
  .notification-message {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 5px;
  }
  
  .notification-time {
    font-size: 11px;
    color: #adb5bd;
  }
  
  .profile-dropdown {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  .profile-dropdown:hover {
    background-color: rgba(0, 123, 246, 0.1);
    color: #007BF6;
  }
  
  .profile-dropdown:hover .profile-icon,
  .profile-dropdown:hover .user-name {
    color: #007BF6;
  }
  
  .profile-icon {
    color: #666;
    font-size: 18px;
    transition: color 0.3s ease;
  }
  
  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    transition: color 0.3s ease;
  }
  
  .logo-text {
    font-family: 'Inknut Antiqua', serif;
    font-size: 30px;
    font-weight: bolder;
    color: white;
    text-shadow: 
      1px 1px 0 #034694, 
      -1px 1px 0 #034694,
      1px -1px 0 #034694,
      -1px -1px 0 #034694,
      0px 1px 0 #034694,
      0px -1px 0 #034694,
      1px 0px 0 #034694,
      -1px 0px 0 #034694;
    line-height: 1.2;
  }
  
  .notification-icon {
    color: #666;
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .notification-icon:hover {
    color: #007BF6;
  }
  </style>