import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Search, Calendar, TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";
import { formatIndianCurrency } from "@/lib/utils";

const BalanceSheetContent = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    console.log("Search clicked", { startDate, endDate });
    // Add search logic here
  };

  // Sample data for demonstration - replace with actual data
  const sampleData = {
    totalAssets: 2500000,
    totalLiabilities: 1800000,
    totalEquity: 700000,
    profitLoss: 50000,
    assets: [
      { name: "Cash & Cash Equivalents", amount: 500000 },
      { name: "Accounts Receivable", amount: 800000 },
      { name: "Inventory", amount: 600000 },
      { name: "Fixed Assets", amount: 600000 }
    ],
    liabilities: [
      { name: "Accounts Payable", amount: 400000 },
      { name: "Short-term Loans", amount: 600000 },
      { name: "Long-term Debt", amount: 800000 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Balance Sheet
              </h1>
              <p className="text-muted-foreground">View financial position and balance summary</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Assets</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(sampleData.totalAssets)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Liabilities</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(sampleData.totalLiabilities)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <TrendingDown className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Equity</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(sampleData.totalEquity)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Net Profit/Loss</p>
                    <p className="text-2xl font-bold">{formatIndianCurrency(sampleData.profitLoss)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          {/* Date Filter Card */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                  <Search className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>Filter by Date Range</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary font-semibold px-8 py-2 h-11 w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    SEARCH
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Sheet Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assets */}
            <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader className="border-b border-border/10 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span>Assets</span>
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    {formatIndianCurrency(sampleData.totalAssets)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                        <th className="border border-border/20 px-4 py-3 text-left font-semibold">Asset Type</th>
                        <th className="border border-border/20 px-4 py-3 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.assets.map((asset, index) => (
                        <tr key={asset.name} className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                          <td className="border border-border/20 px-4 py-3 text-foreground">
                            {asset.name}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-right text-foreground font-semibold text-emerald-600">
                            {formatIndianCurrency(asset.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 font-bold">
                        <td className="border border-border/20 px-4 py-3 text-foreground">
                          Total Assets
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-right text-foreground font-bold text-emerald-600">
                          {formatIndianCurrency(sampleData.totalAssets)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Liabilities & Equity */}
            <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <CardHeader className="border-b border-border/10 bg-gradient-to-r from-red-500/10 to-red-600/10">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                    <TrendingDown className="h-5 w-5 text-white" />
                  </div>
                  <span>Liabilities & Equity</span>
                  <span className="text-sm font-normal text-muted-foreground ml-auto">
                    {formatIndianCurrency(sampleData.totalLiabilities + sampleData.totalEquity)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                        <th className="border border-border/20 px-4 py-3 text-left font-semibold">Item</th>
                        <th className="border border-border/20 px-4 py-3 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Liabilities Section */}
                      <tr className="bg-gradient-to-r from-red-500/10 to-red-600/10">
                        <td className="border border-border/20 px-4 py-3 text-foreground font-semibold" colSpan={2}>
                          LIABILITIES
                        </td>
                      </tr>
                      {sampleData.liabilities.map((liability, index) => (
                        <tr key={liability.name} className={`hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                          <td className="border border-border/20 px-4 py-3 text-foreground pl-8">
                            {liability.name}
                          </td>
                          <td className="border border-border/20 px-4 py-3 text-right text-foreground font-semibold text-red-600">
                            {formatIndianCurrency(liability.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gradient-to-r from-red-500/20 to-red-600/20">
                        <td className="border border-border/20 px-4 py-3 text-foreground font-bold">
                          Total Liabilities
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-right text-foreground font-bold text-red-600">
                          {formatIndianCurrency(sampleData.totalLiabilities)}
                        </td>
                      </tr>
                      
                      {/* Equity Section */}
                      <tr className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                        <td className="border border-border/20 px-4 py-3 text-foreground font-semibold" colSpan={2}>
                          EQUITY
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50 transition-colors">
                        <td className="border border-border/20 px-4 py-3 text-foreground pl-8">
                          Owner's Equity
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-right text-foreground font-semibold text-blue-600">
                          {formatIndianCurrency(sampleData.totalEquity)}
                        </td>
                      </tr>
                      
                      {/* Total */}
                      <tr className="bg-gradient-to-r from-primary/20 to-primary/30 font-bold">
                        <td className="border border-border/20 px-4 py-3 text-foreground">
                          Total Liabilities & Equity
                        </td>
                        <td className="border border-border/20 px-4 py-3 text-right text-foreground font-bold text-primary">
                          {formatIndianCurrency(sampleData.totalLiabilities + sampleData.totalEquity)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balance Verification */}
          <Card className="border-0 shadow-xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardHeader className="border-b border-border/10 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span>Balance Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-700 mb-2">Total Assets</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatIndianCurrency(sampleData.totalAssets)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">Liabilities + Equity</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatIndianCurrency(sampleData.totalLiabilities + sampleData.totalEquity)}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm font-medium text-purple-700 mb-2">Balance Status</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sampleData.totalAssets === (sampleData.totalLiabilities + sampleData.totalEquity) ? "✓ Balanced" : "⚠ Unbalanced"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetContent;