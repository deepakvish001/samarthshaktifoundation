const AdminFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-t border-slate-700 py-8 mt-12 shadow-2xl">
      <div className="container mx-auto px-8">
        <div className="text-center">
          <div className="animate-fade-in">
            <p className="text-lg font-semibold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Copyright © 2020 SAMARTH SHAKTI FOUNDATION. All rights reserved.
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Design By <span className="text-blue-400 hover:text-blue-300 transition-colors duration-200 cursor-pointer">Deepak Vishwakarma</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;