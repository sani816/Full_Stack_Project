# 📚 Smart Study Planner

A full-stack web application that automatically generates a personalized study timetable for students based on subjects, difficulty level, and exam date.
Instead of manually planning, the system intelligently distributes study sessions, revision days, and priorities to help students prepare efficiently.

---
🔗 Live Demo: (https://plan-my-grades.lovable.app)
## 🚀 Features

* User Signup & Login (JWT Authentication)
* AI
* Add Subjects with Difficulty Level
* Automatic Study Schedule Generation
* Smart Priority Allocation (Hard subjects get more time)
* Daily Task Dashboard
* Missed Day Auto-Rescheduling
* Revision Planning before Exam
* Progress Tracking (Completed / Pending)
* Countdown to Exam
* Mobile-friendly UI

---

## 🧠 How It Works

The system calculates a study plan using three main factors:

1. **Remaining Days**
2. **Subject Difficulty**
3. **Number of Subjects**

### Logic

* Hard subjects → More sessions
* Easy subjects → Fewer sessions
* Closer exam date → Higher daily workload
* Last days → Reserved for revision

Example:

| Subject     | Difficulty | Sessions Assigned |
| ----------- | ---------- | ----------------- |
| Mathematics | Hard       | 10                |
| Physics     | Medium     | 7                 |
| English     | Easy       | 4                 |

---

## 🏗️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**Database:** Supabase (PostgreSQL)
**Authentication:** JWT + bcrypt
**Other:** REST API, Date-based algorithm

---


## 📊 Future Improvements

* Email reminders
* Dark mode
* Weekly performance analytics
* Google Calendar integration
* Mobile app (React Native)

---


