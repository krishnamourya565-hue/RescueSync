# Technical Report: RescueSync - Smart Disaster Rehabilitation Platform

## 1. Introduction

### 1.1 Project Background
In the aftermath of natural disasters, the coordination between various relief agencies, volunteers, and the affected population is often chaotic and fragmented. The lack of a centralized communication and management system leads to delayed responses, misallocation of essential resources, and critical gaps in rehabilitation efforts. The RescueSync project was initiated to bridge these gaps by providing a robust, centralized platform that orchestrates post-disaster operations efficiently.

### 1.2 Problem Statement
During disaster recovery phases, government agencies, Non-Governmental Organizations (NGOs), and independent volunteers frequently operate in silos. This decentralized approach results in duplicate efforts, poor resource tracking, and an inability to swiftly address emergent critical tasks. There is a pressing need for an integrated system capable of real-time task management, transparent resource allocation, and instant communication across multiple stakeholder levels.

### 1.3 Objectives and Purpose
The primary objective of the RescueSync platform is to streamline disaster rehabilitation workflows through a unified digital interface. The specific goals include:
- Establishing a secure, role-based access system for distinct user groups (Admins, NGOs, Volunteers).
- Providing real-time task creation, assignment, and tracking capabilities.
- Enabling geographical visualization of disaster zones and task locations.
- Facilitating transparent tracking of critical resources such as food, water, medicine, and funds.
- Implementing a robust reporting mechanism for field updates and visual proof of work.

### 1.4 Scope and Significance
The scope of this project encompasses the development of a full-stack web application accessible via modern web browsers. It focuses on the immediate post-disaster rehabilitation phase rather than long-term reconstruction. The significance of RescueSync lies in its potential to drastically reduce response times, optimize resource utilization, and foster a collaborative environment among disparate relief entities, ultimately saving lives and accelerating recovery.

## 2. System Architecture

### 2.1 Overall Architecture
RescueSync employs a modern, hybrid client-server and Backend-as-a-Service (BaaS) architecture. It leverages a centralized API layer for complex business logic and real-time socket communications, while transitioning towards a true serverless model for secure, direct data interactions and authentication. The architecture follows a multi-tier model consisting of a presentation layer, an application layer, and a robust data persistence layer.

### 2.2 System Components and Modules
- **Authentication Module:** Handles secure user registration, login, and token management, utilizing native BaaS authentication mechanisms and JSON Web Tokens (JWTs).
- **Role-Based Access Control (RBAC):** Enforces Row Level Security (RLS) and custom permissions tailored to Admins, NGOs, and Volunteers.
- **Task Management Engine:** Facilitates the lifecycle of a task from creation and geographical assignment to execution and resolution.
- **Resource Tracking Module:** Maintains a dynamic inventory ledger for critical supplies and financial donations.
- **Real-Time Notification System:** Pushes instant updates to connected clients using WebSocket protocols when tasks or resources change.
- **Geospatial Mapping Interface:** Renders interactive maps with precise coordinate mapping for situational awareness.

### 2.3 Data Flow and Interaction
The standard data flow initiates with the user interacting with the React-based frontend. Action requests (e.g., creating a task) are formatted as HTTP requests or secure direct database mutations. If routed through the Node.js backend, the Express application validates the payload and updates the MongoDB database. Simultaneously, the Socket.io server broadcasts the state change to all active, authenticated clients, triggering immediate UI updates. For operations utilizing Supabase, the frontend communicates directly with the PostgreSQL database, where built-in triggers and Realtime channels automatically push updates back to subscribed clients.

### 2.4 Technologies Used
- **Frontend:** React.js, Vite, React Router, plain CSS with a Glassmorphism design paradigm.
- **Mapping:** Leaflet.js and React-Leaflet leveraging OpenStreetMap data.
- **Backend Application Layer:** Node.js, Express.js.
- **Real-Time Communication:** Socket.io.
- **Databases and BaaS:** MongoDB (Mongoose ODM) and Supabase (PostgreSQL, Auth, Realtime).

## 3. Implementation

### 3.1 Development Process
The development lifecycle adhered to an Agile methodology. Initial phases focused on requirements gathering and schema design, followed by the rapid prototyping of the user interface. The backend API endpoints and WebSocket channels were developed iteratively alongside the frontend state management integration. The final phase involved migrating key authentication and real-time database operations to a serverless BaaS infrastructure to enhance scalability.

### 3.2 Tools and Frameworks
- **Development Environment:** Visual Studio Code, Node Package Manager (npm).
- **Frontend Framework:** React 18 orchestrated by the Vite build tool for optimized hot module replacement and bundling.
- **Backend Framework:** Express 4.19 for RESTful API routing.
- **Security:** bcryptjs for password hashing and jsonwebtoken for session management.

### 3.3 Key Features and Functionalities
The implementation successfully yielded a platform where Admins can oversee global operations and dispatch tasks. NGOs can claim tasks, update their progress, and submit detailed field reports complete with imagery. Volunteers receive a simplified dashboard to track local assignments. The integration of live mapping provides a visual dashboard of critical hotspots, updating dynamically without necessitating manual page refreshes.

### 3.4 Important Code Logic
A critical piece of the application logic is the real-time state synchronization. When a new task is inserted into the database, an asynchronous function handles the initial write operation. Upon confirmation, a broadcast mechanism is triggered. In the Node.js implementation, `socket.emit` distributes the newly serialized task object to connected clients. In the BaaS implementation, PostgreSQL triggers listen for `INSERT` operations on the tasks table, dispatching a notification over WebSockets. The frontend React components utilize custom hooks (`useEffect`) to subscribe to these channels, seamlessly updating the local state arrays and re-rendering the relevant UI components.

## 4. Result and Discussion

### 4.1 System Output
The RescueSync platform delivers a highly responsive, single-page application (SPA) experience. Users are greeted with a secure login portal that dynamically routes them to role-specific dashboards. The interactive map successfully renders data points representing disaster zones, while the real-time feed displays incoming tasks and resource updates instantaneously.

### 4.2 Problem Resolution
By providing a unified dashboard, RescueSync directly addresses the problem of fragmented communication. NGOs no longer have to rely on disjointed message threads to discover where help is needed; tasks are visually mapped and centrally logged. The resource tracker mitigates the risk of supply hoarding or misallocation by providing transparent, up-to-date inventory levels visible to all authorized stakeholders.

### 4.3 Performance and Efficiency
The adoption of Vite for frontend building significantly reduced load times, resulting in a swift initial render. The integration of WebSocket-based real-time updates eliminates the overhead associated with traditional HTTP polling, substantially reducing server load and network bandwidth consumption. The transition to a serverless BaaS model further optimized query resolution times and authentication handshakes.

### 4.4 Limitations and Challenges
A primary challenge encountered during development was ensuring data consistency across multiple real-time clients, particularly during high-concurrency scenarios where multiple users attempt to claim the same task simultaneously. Additionally, the system currently requires a stable internet connection to function optimally; an offline-first architecture with local caching and subsequent background synchronization remains an area for future improvement.

## 5. Conclusion

### 5.1 Summary of Work
The RescueSync platform was successfully designed and developed as a comprehensive solution for post-disaster rehabilitation management. The system integrates modern web technologies, robust database architectures, and real-time communication protocols to deliver a highly interactive and practical management tool.

### 5.2 Achievement of Objectives
The project successfully achieved its core objectives. The role-based access system is fully functional, ensuring data security and tailored user experiences. Real-time task and resource tracking, coupled with geographical mapping, provide a holistic view of the rehabilitation effort, proving the viability of a centralized disaster management platform.

### 5.3 Future Enhancements
Future iterations of RescueSync should focus on developing progressive web app (PWA) capabilities to support offline functionality. Integrating AI-driven predictive analytics could assist in anticipating resource shortages based on incoming field reports. Furthermore, the inclusion of a dedicated mobile application utilizing React Native would provide field workers with a more native, integrated experience.

## 6. References

[1] D. Crockford, "The application/json Media Type for JavaScript Object Notation (JSON)," RFC 4627, July 2006.
[2] "React - A JavaScript library for building user interfaces." React Documentation. [Online]. Available: https://reactjs.org/. [Accessed: April 2026].
[3] "Express - Node.js web application framework." Express Documentation. [Online]. Available: https://expressjs.com/. [Accessed: April 2026].
[4] "Supabase - The open source Firebase alternative." Supabase Documentation. [Online]. Available: https://supabase.com/docs. [Accessed: April 2026].
[5] V. Agafonkin, "Leaflet - a JavaScript library for interactive maps." Leaflet Documentation. [Online]. Available: https://leafletjs.com/. [Accessed: April 2026].
[6] "Vite - Next Generation Frontend Tooling." Vite Documentation. [Online]. Available: https://vitejs.dev/. [Accessed: April 2026].
