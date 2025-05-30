# Reposcope 🚀

A powerful web application that provides deep insights into GitHub profiles, helping users understand their coding journey and potential areas for improvement.

## ✨ Features

### 💰 Account Value Estimator
- Estimates GitHub account worth based on public data
- Considers contributions, repositories, followers, and more
- Provides detailed breakdown of value factors

### 📦 Repository Overview
- Comprehensive list of public repositories
- Advanced sorting and filtering capabilities
- Repository statistics and metrics

### 📊 Tech Stack Analysis
- Language usage visualization with percentages
- Interactive progress bars for each language
- Language-specific icons and tooltips
- Detailed language distribution statistics

### 🗓️ Activity Timeline
- Interactive calendar heatmaps
- Monthly and yearly activity views
- Contribution patterns analysis
- Total contributions tracking

### ⏱️ Time-Based Insights
- Daily activity trends
- Monthly contribution patterns
- Yearly growth analysis

### 👥 User Comparison
- Side-by-side profile comparison
- Contribution metrics comparison
- Tech stack comparison
- Repository analysis

### 📄 PDF Report Export
- Professional PDF report generation
- Customizable report sections
- Beautiful visualizations and charts

### 🤖 AI-Powered Recommendations
- Personalized improvement suggestions
- Documentation quality analysis
- Testing coverage recommendations
- Open source contribution guidance

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **Data Visualization**: Recharts/Chart.js
- **Animations**: Framer Motion, Three.js, Particle.js
- **API Integration**: GitHub REST API & GraphQL API
- **Authentication**: GitHub OAuth
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- GitHub account
- GitHub Personal Access Token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reposcope.git
cd reposcope
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:
```env
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📝 Environment Variables

- `VITE_GITHUB_TOKEN`: GitHub Personal Access Token with the following permissions:
  - `repo` (Full control of private repositories)
  - `read:user` (Read user profile data)
  - `read:org` (Read organization data)

## 🔜 Future Enhancements

The following features are planned for future updates:

### Tech Stack Analysis
- Framework detection and analysis
- Database technology detection
- Development tools and utilities detection
- More comprehensive tech stack patterns

### Enhanced Visualization
- More detailed contribution graphs
- Advanced tech stack visualization
- Interactive data exploration
- Custom visualization options

### Additional Features
- More detailed repository analysis
- Enhanced comparison features
- Advanced recommendation system
- Custom report templates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub API for providing comprehensive data
- All contributors who help improve this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by Sakthimurugan S