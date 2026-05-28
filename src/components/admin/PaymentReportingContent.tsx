const PaymentReportingContent = () => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center p-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-2xl border border-green-100 animate-fade-in">
        <div className="animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Payment Reporting
          </h2>
          <p className="text-xl text-slate-600 mb-6">Coming Soon...</p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReportingContent;