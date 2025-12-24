# 🧍‍♂️ AI-Based Full Body Measurement Estimation (Approximate)

## 📌 Overview

This project estimates **approximate human body measurements** using **three RGB images** of the same person:

- Front view  
- Side view  
- Standing (neutral posture)  

The system uses **hybrid pose estimation** and **anthropometric scaling** to infer body dimensions **without** requiring:

- Depth sensors  
- Calibration objects  
- User-provided height  

⚠️ Measurements are **approximate** and intended for **educational and demonstration purposes only**.

---

## 📥 Input

The system requires **three full-body RGB images**:

1. Front view image  
2. Side view image  
3. Standing / neutral posture image  

### Image Guidelines
- Well-lit environment  
- Full body visible (head to feet)  
- Neutral standing posture  
- Minimal background clutter  

---

## 📤 Output

The system estimates the following measurements (in **centimeters**):

- Estimated Height  
- Shoulder Width  
- Chest (derived)  
- Hip (derived)  
- Arm Length  
- Leg / Inseam Length  

If image quality is low, the system returns a warning indicating reduced accuracy.

Example warning:
⚠️ Low image clarity may reduce chest/hip accuracy


---

## 🧠 Approach Used

### 1️⃣ Hybrid Pose Estimation

Two pre-trained pose estimation models are used:

#### MediaPipe Pose
- Stable and fast skeletal keypoint detection  
- Reliable on CPU environments  

#### YOLOv8 COCO Pose
- COCO-standard pose keypoints  
- Used as a secondary validation model  

**For each image:**
- Keypoints are extracted using both models  
- Measurements are fused using **median aggregation**  
- This reduces noise and model-specific errors  

---

### 2️⃣ Multi-View Fusion

Measurements are computed independently for:
- Front image  
- Side image  
- Standing image  

Final values are obtained using the **median across all valid views**, which:
- Improves robustness  
- Reduces pose-related errors  
- Handles partial occlusions more effectively  

---

## 📏 Scaling Logic

Since absolute scale cannot be recovered from RGB images alone, the system uses a **weak anthropometric scaling strategy**.

### Key Steps:
- Pixel-level skeletal measurements are extracted using pose keypoints  
- Scale-independent ratios are computed:
  - `arm_length / body_height`
  - `leg_length / body_height`
- A **soft anthropometric prior** (average human shoulder width) is used to estimate height  
- Chest and hip measurements are **derived** using anthropometric correction factors  

### This approach avoids:
- Fixing height to a constant value  
- Asking users to manually input height  
- Unrealistic pixel-to-centimeter conversions  

---

## ⚠️ Assumptions & Limitations

### Assumptions
- Full body visible in all images  
- Neutral standing posture  
- RGB images only (no depth information)  
- Average human body proportions apply  

### Limitations
- Exact height cannot be guaranteed without a reference object or depth sensor  
- Chest and hip measurements are approximations  
- Loose clothing, motion blur, or poor lighting may reduce accuracy  
- Measurements are **not medical-grade**  

If image clarity is low, the system explicitly reports a warning.

---

## 🎯 Accuracy & Justification

- Target accuracy: **~80–85%** under controlled conditions  
- Accuracy is evaluated relative to **pose-derived pseudo ground truth**  
- Arm and leg lengths are generally more reliable than chest or hip girth  
- Hybrid models and multi-view fusion significantly improve stability  

> The project prioritizes **realistic accuracy, transparency, and explainability** over exaggerated claims.

---

## 🛠️ Tech Stack

- Python  
- FastAPI  
- MediaPipe Pose  
- YOLOv8 (Ultralytics – COCO Pose)  
- OpenCV  
- NumPy  

---

## ⚠️ Disclaimer

This system is developed **solely for educational and research demonstration purposes**.

- Measurements are approximate  
- Not suitable for medical, legal, or professional tailoring applications  

Use at your own discretion.

---

## ✅ Conclusion

This project demonstrates how **hybrid pose estimation**, **multi-view fusion**, and **anthropometric reasoning** can be combined to estimate human body measurements from RGB images in a **practical, honest, and explainable** manner—without relying on depth sensors or manual calibration.
