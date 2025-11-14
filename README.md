# ITML HR Automation App

A mobile HR request automation system built as a learning project after completing  
**“The Complete React Native & Redux Course”**.  
The system simulates a mini HR workflow used in real companies:

- Employees submit **Annual** or **Remote Work** requests  
- Managers review & approve annual requests  
- HR provides final approval for all requests  
- Calendar view for visualizing approved leaves  

Built with **React Native (Expo)**, **Express**, and **MongoDB**.

---

## 🚀 Features

### 👤 Employee
- Submit Annual Leave Request  
- Submit Remote Work Request  
- View Request Status  
- View Request History  
- Calendar with approved leaves  

### 👨‍💼 Manager  
- Approve / Reject Annual Leave Requests  
- View Team Overview  
- Team annual leave calendar  

### 🧑‍💼 HR
- Approve / Reject All Requests  
- View Company Calendar  
- Basic metrics & overview  

---

## 🏗 Tech Stack

| Layer          | Technology             | Purpose                         |
|----------------|-------------------------|---------------------------------|
| Frontend       | React Native (Expo)    | Cross-platform mobile app       |
| Backend        | Node.js + Express      | REST API                        |
| Database       | MongoDB (Mongoose)     | Data persistence                |
| State / Auth   | Context API            | Session & role management       |
| UI Design      | Dark Mode + ITML Green | Modern consistent styling       |

---

# 📦 Installation & Setup

This project contains **two parts**:

```
/client  → React Native app  
/server  → Express + MongoDB backend
```

Install & run **both**.

---

# 🔧 1. Backend Setup (Express API)

### 1️⃣ Navigate into the backend folder:
```bash
cd server
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Create a `.env` file:
Create `server/.env` using the template:

```env
MONGO_URI=mongodb://localhost:27017/itmlapp
PORT=5000
```

### 4️⃣ Start the server:
```bash
npm start
```

Backend will run at:  
📌 **http://localhost:5000**

---

# 📱 2. Mobile App Setup (React Native)

### 1️⃣ Navigate into the app:
```bash
cd client
```

### 2️⃣ Install dependencies:
```bash
npm install
```

### 3️⃣ Start the Expo app:
```bash
npm start
```

Choose:
- **Android Emulator**
- **Physical Android device (Expo Go)**
- **Web** (optional)

---

## 📡 API Configuration

The app uses this default API URL:

```
http://10.0.2.2:5000  → Android emulator loopback
```

If you're running on a **physical device**, replace with your machine's local IP:

```
http://YOUR_LOCAL_IP:5000
```

---

# 🤳 Screenshots
(Add your images)

---

# 🧠 My Learning Outcomes

- Strengthened React Native fundamentals  
- Built real REST API with Express and MongoDB  
- Implemented role-based logic and multi-user workflows  
- Improved async flow handling and component structure  
- Built a mini production-like system end-to-end  

---

# 🔮 Future Enhancements

- Push notifications for approvals  
- JWT authentication  
- Deploy backend to cloud with MongoDB Atlas  
- Expand HR analytics (dashboards)

---

# 📎 Project Link  
👉 https://github.com/bokaris/itmlApp

---

# 👤 Author  
**Alexandros Bokaris**  
Built as part of personal upskilling in React Native & backend development.
