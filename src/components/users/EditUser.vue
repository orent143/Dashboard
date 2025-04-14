<template>
    <div v-if="show" class="modal">
      <div class="modal-content">
        <h2>Edit User</h2>
        <form @submit.prevent="confirmSubmit">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="formData.name" required />
          </div>
  
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" required />
          </div>
  
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="formData.role" required>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
  
          <div class="form-group" v-if="formData.role === 'student'">
            <label for="degree">Degree</label>
            <input type="text" id="degree" v-model="formData.degree" required />
          </div>
  
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="close">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  
    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmModal"
      title="Confirm Update"
      :message="`Are you sure you want to update ${formData.name}'s information?`"
      confirm-text="Update User"
      type="primary"
      @confirm="handleSubmit"
      @cancel="showConfirmModal = false"
    />
  </template>
  
  <script>
  import { useToast } from 'vue-toastification';
  import ConfirmationModal from '@/components/ConfirmationModal.vue';
  
  export default {
    name: 'EditUser',
    components: { ConfirmationModal },
    props: {
      show: { type: Boolean, required: true },
      user: { type: Object, required: true }
    },
    data() {
      return {
        formData: {
          name: '',
          email: '',
          role: '',
          degree: ''
        },
        showConfirmModal: false
      };
    },
    watch: {
      user: {
        handler(newUser) {
          if (newUser) {
            this.formData = { ...newUser };
          }
        },
        immediate: true
      }
    },
    setup() {
      const toast = useToast();
      return { toast };
    },
    methods: {
      confirmSubmit() {
        if (!this.validateForm()) return;
        this.showConfirmModal = true;
      },
      validateForm() {
        if (!this.formData.name.trim()) {
          this.toast.error('Name is required');
          return false;
        }
        if (!this.formData.email.trim()) {
          this.toast.error('Email is required');
          return false;
        }
        if (!this.formData.role) {
          this.toast.error('Role is required');
          return false;
        }
        if (this.formData.role === 'student' && !this.formData.degree?.trim()) {
          this.toast.error('Degree is required for students');
          return false;
        }
        return true;
      },
      handleSubmit() {
        // Dummy update logic (no backend call)
        this.toast.success(`${this.formData.name}'s information has been updated (dummy)!`);
  
        // Emit updated data to parent
        this.$emit('update', this.formData);
        this.close();
      },
      close() {
        this.showConfirmModal = false;
        this.$emit('close');
      }
    }
  };
  </script>
  
  
  <style scoped>
  .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
  }
  
  .modal-content {
      background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    position: relative;
  }
  
  .modal-content h2 {
      font-size: 25px;
    font-family: 'Arial', sans-serif;
    font-weight: 1000;
    color: #000000;
    padding-right: 30px;
  }
  
  .form-group {
      margin-bottom: 20px;
  }
  
  .form-group label {
      display: flex;
    flex-direction: column;
    font-weight: 600;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    margin-bottom: 5px;
    color: #272727;
  }
  
  .form-group input,
  .form-group select {
      padding: 10px;
    font-size: 14px;
    border-radius: 12px;
    width: 100%;
    border: 1px solid #ccc;
  }
  
  .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 30px;
  }
  
  .modal-actions button {
      padding: 8px 12px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .save-btn {
      padding: 10px 20px;
    background-color: #007BF6;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
  }
  
  .cancel-btn {
      padding: 10px 20px;
    background-color:#5a6268;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
  }
  
  button:hover {
    background: #272727;
  }
  </style>