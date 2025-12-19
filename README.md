  # 🍽️ Restaurant Management System (AWS Serverless)

A cloud-based, serverless **Restaurant Order & Delivery Management System** built using **Amazon Web Services (AWS)**.  
This project demonstrates how modern cloud-native design principles can be applied to build a scalable, modular, and reliable food delivery platform similar to real-world systems like Uber Eats or DoorDash.

This is a code bundle for Restaurant Management System. The original project is available at https://www.figma.com/design/fZvA1hsiVGQlMc1ceUIq56/Restaurant-Management-System.

---

## 📌 Project Overview

The system enables users to:
- Register and authenticate securely  
- Browse restaurants and search menu items  
- Place and track orders  
- Receive order status notifications  
- Rate restaurants and upload food photos  
- Get personalized restaurant recommendations  

The architecture is fully **serverless and event-driven**, minimizing operational overhead while ensuring scalability and fault tolerance.

---

## 🏗️ System Architecture

The system follows a **serverless microservices architecture** using AWS managed services:

- **Frontend** → Hosted on Amazon S3 and delivered via CloudFront  
- **API Gateway** → Central entry point for all client requests  
- **AWS Cognito** → Authentication & authorization  
- **AWS Lambda** → Business logic (orders, search, payment, ratings)  
- **Amazon DynamoDB** → Menus, orders, users, ratings  
- **Amazon OpenSearch** → Keyword-based menu search  
- **Amazon S3** → Food photos and static assets  
- **Amazon SNS** → Order notifications  
- **AWS Personalize** → Personalized recommendations  

Each service is loosely coupled and independently scalable.

---

## 🔑 Key Features

### 🔐 Authentication
- User registration and login using **AWS Cognito**
- JWT-based authorization enforced by API Gateway

### 🔍 Search & Browsing
- Structured restaurant and menu queries via **DynamoDB**
- Keyword-based menu search using **Amazon OpenSearch**

### 📦 Order Management
- Order creation and lifecycle management using Lambda
- Order states: *Placed → Confirmed → Delivered*

### 💳 Payment Processing
- Simulated payment workflow using Lambda
- Designed for easy integration with real payment gateways

### 📧 Notifications
- **Amazon SNS** sends order confirmations and status updates
- Asynchronous, event-driven notification delivery

### ⭐ Ratings & Photo Uploads
- Users can rate restaurants after completing orders
- Food photos uploaded securely using pre-signed S3 URLs

### 🎯 Personalized Recommendations
- User profiles and interaction data stored in DynamoDB
- **AWS Personalize** generates restaurant and menu recommendations

---

## 🌐 Frontend Hosting (S3 + CloudFront)

- Frontend is built as a static web application  
- Static assets are uploaded to **Amazon S3**  
- **Amazon CloudFront** is used as a CDN for:
  - Low-latency global content delivery  
  - HTTPS support  
  - Improved performance and caching  
- CloudFront routes frontend API calls to Amazon API Gateway  

---

## 📊 Dataset

- **Uber Eats USA Restaurants and Menus Dataset** (Kaggle)
- Contains restaurant metadata, menu categories, items, and pricing
- Cleaned and normalized before ingestion into AWS services

---

## ⚙️ Technology Stack

| Layer | Technologies |
|------|-------------|
| Frontend | HTML / CSS / JavaScript |
| Hosting | Amazon S3 + CloudFront |
| API | Amazon API Gateway |
| Compute | AWS Lambda |
| Authentication | AWS Cognito |
| Database | Amazon DynamoDB |
| Search | Amazon OpenSearch |
| Storage | Amazon S3 |
| Messaging | Amazon SNS |
| Recommendations | AWS Personalize |

---

## 🚀 Deployment & Execution

### Frontend
1. Build static frontend assets  
2. Upload build files to an Amazon S3 bucket  
3. Configure CloudFront distribution with S3 as origin  
4. Enable HTTPS and caching via CloudFront  

### Backend
- Lambda functions deployed behind API Gateway
- IAM roles control secure service-to-service access

### Authentication
- Cognito User Pool integrated with frontend and API Gateway

> ⚠️ AWS credentials and resource configurations are required before deployment.

---

## 📈 Results & Performance

- Sub-100ms latency for menu search operations  
- Reliable, near real-time order notifications  
- Automatic scaling under concurrent workloads  
- End-to-end user flow fully operational  

---

## ⚠️ Current Limitations

- Payment gateway is simulated (no real transactions)
- Email notifications limited by SNS subscription model
- Recommendation quality depends on available user interaction data
- Real-time delivery tracking not implemented

---

## 🔮 Future Enhancements

- Integration with real payment gateways (Stripe, PayPal)
- Enhanced recommendations using richer user signals
- Analytics dashboards for restaurant owners
- Real-time delivery tracking and push notifications
- Cost optimization and large-scale performance benchmarking

---

## 🎥 Demo

- **Live Application**: https://d3t9ac16dxeckl.cloudfront.net/  
- **Demo Video**: https://youtu.be/IVmdjoqLdRI  

---

## 📄 License

This project was developed for academic purposes as part of coursework at **New York University**.

