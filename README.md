# SL_ARENA - Sports Tournament Management Platform

## 📱 Project Overview

**SL_ARENA** is a comprehensive cricket tournament management platform consisting of three main applications: a mobile app, a backend server, and an admin web interface. The platform is designed specifically for cricket tournaments and sports management in Sri Lanka.

### 🏗️ **Project Architecture**

The project follows a **three-tier architecture**:

1. **Mobile App** (`slarena/`) - React Native with Expo
2. **Backend Server** (`server/`) - Node.js/Express API
3. **Admin Panel** (`slarena-admin/`) - Next.js web application

---

### 📱 **Mobile Application (React Native + Expo)**

**Technology Stack:**
- **Framework:** React Native with Expo (v52)
- **Navigation:** React Navigation v7
- **UI Components:** React Native Elements, React Native Paper
- **State Management:** Context API
- **Maps:** React Native Maps
- **Real-time:** Socket.IO Client
- **Media:** Expo Image Picker, Expo AV
- **Animations:** Lottie, Moti, React Native Reanimated

**Key Features:**
- **Multi-role Authentication** (Player, Organizer, Trainer, Admin, General User)
- **Real-time Notifications** with Socket.IO
- **Interactive Maps** for venue discovery and location services
- **Media Management** (Photo/Video upload for matches and profiles)
- **Tournament Management** (Create, join, manage tournaments)
- **Team Management** (Create teams, add/remove players)
- **Live Match Scoring** and statistics tracking
- **Player Profiles** with stats and achievements
- **Leaderboards** and performance analytics
- **Calendar Integration** for sports events

---

### 🖥️ **Backend Server (Node.js + Express)**

**Technology Stack:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL with SSL connection
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer with Cloudinary integration
- **Real-time:** Socket.IO
- **Security:** Helmet, CORS, Rate Limiting, Bcrypt

**Core Modules:**

#### **Controllers & Routes:**
- **User Management:** Registration, login, profile management, role upgrades
- **Player Operations:** Stats, achievements, performance tracking, media uploads
- **Team Management:** Team creation, player management, tournament applications
- **Tournament Organization:** Tournament creation, bracket generation, match scheduling
- **Admin Functions:** Role upgrade requests, user verification, system management
- **Place Services:** Venue discovery, saved places, nearby location search
- **Feed System:** Activity feeds and notifications
- **Match Scoring:** Live scoring, inning management, player statistics

#### **Database Models:**
- Users, Players, Teams, Tournaments
- Matches, Innings, Deliveries
- Photos, Videos, Places
- Notifications, Feed items
- Admin operations and role requests

#### **Authentication & Authorization:**
- Role-based access control (Player, Organizer, Trainer, Admin, General)
- JWT token authentication
- Middleware for route protection

---

### 🌐 **Admin Panel (Next.js)**

**Technology Stack:**
- **Framework:** Next.js 15 with Turbopack
- **Styling:** Tailwind CSS v4
- **Development:** TypeScript support

**Purpose:**
- Administrative interface for platform management
- Tournament oversight and moderation
- User role management and verification
- System analytics and reporting

---

### 🏏 **Core Cricket Features**

#### **Tournament Management:**
- **Tournament Types:** Knockout, league formats
- **Bracket Generation:** Automated knockout draw creation
- **Team Registration:** Application and approval system
- **Match Scheduling:** Automated fixture generation

#### **Live Match Scoring:**
- **Ball-by-ball Commentary:** Real-time delivery tracking
- **Player Statistics:** Batting, bowling, fielding stats
- **Inning Management:** Detailed scorecards
- **Match States:** Live match progression tracking

#### **Player Development:**
- **Performance Analytics:** Trend analysis and improvement tracking
- **Achievement System:** Milestone tracking and recognition
- **Training Reminders:** Scheduled training notifications
- **Profile Customization:** Player attributes (batting style, bowling type, fielding position)

---

### 🔧 **Technical Infrastructure**

#### **Database Design:**
- **MySQL Database** with SSL encryption
- **Relational Structure** for complex cricket data relationships
- **Migration Support** for database version control

#### **Security Features:**
- **JWT Authentication** with role-based access
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for cross-origin requests
- **SSL/TLS Encryption** for data transmission
- **Input Validation** and sanitization

#### **Real-time Features:**
- **Socket.IO Integration** for live updates
- **Team Notifications** for invitations and updates
- **Match Updates** in real-time
- **Tournament Announcements**

#### **Media Management:**
- **Cloudinary Integration** for image/video storage
- **Optimized Media Delivery** with CDN
- **Multi-format Support** for various media types

---

### 🎯 **Target Users**

1. **Cricket Players:** Manage profiles, join teams, participate in tournaments
2. **Tournament Organizers:** Create and manage cricket tournaments
3. **Team Captains:** Form teams, recruit players, manage team activities
4. **Trainers/Coaches:** Monitor player development and training
5. **General Users:** Follow tournaments, view player profiles
6. **Administrators:** Oversee platform operations and user management

---

### 🌟 **Unique Features**

1. **Sri Lankan Cricket Focus:** Tailored for local cricket community
2. **Comprehensive Role System:** Multiple user types with specific permissions
3. **Real-time Match Experience:** Live scoring and commentary
4. **Geographic Integration:** Location-based venue discovery
5. **Media-rich Profiles:** Photo and video portfolios for players
6. **Social Features:** Team formation, invitations, and community building

---

## 🚀 **Development & Deployment**

### **Environment Configuration:**
- **Environment Variables** for different deployment stages
- **SSL Certificate Management** for secure database connections
- **API Endpoint Configuration** for different environments

---

# React Native Setup Guide (Windows)

## 🛠️ Android SDK Setup

### 1. Prepare SDK Directory
- Create the following directory:
  ```
  C:\Android\Sdk
  ```
- Extract the downloaded Android SDK `.zip` file.
- Copy the `cmdline-tools` folder into:
  ```
  C:\Android\Sdk\
  ```
- Inside `cmdline-tools`, create a folder named `latest`, and **move all contents** from `cmdline-tools` into this `latest` folder. Your structure should look like this:
  ```
  C:\Android\Sdk\cmdline-tools\latest\bin
  ```

---

## 🔧 Environment Variables Setup

### Add to `PATH`:
- `C:\Android\Sdk\cmdline-tools\latest\bin`
- `C:\Android\Sdk\platform-tools` *(will be available after installing platform tools)*

### Add System Variable:
- **Key:** `ANDROID_HOME`  
- **Value:** `C:\Android\Sdk`

---

## 📦 Install Android Packages

Open Command Prompt and run:

```bash
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"
```

This will download and add the required tools under `C:\Android\Sdk\platform-tools`.

---

## 🧑‍💻 Project Setup in VS Code

### 1. Open Project in VS Code
- Open File Explorer and navigate to your project directory.
- In the address bar, type:
  ```
  cmd
  ```
- Then run:
  ```
  code .
  ```

---

## 🚀 Running the App

### Terminal 1: Start Metro Bundler

```bash
cd slarena
npx react-native start
```

### Terminal 2: Run the App on Device

1. Connect your Android device via USB.
2. Make sure **Developer Mode** and **USB Debugging** are enabled.
3. Then run:

```bash
cd slarena
npx react-native run-android
```
