import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 shadow-2xl text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access this resource
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This page requires special permissions that your account doesn't currently have. 
              Please contact an administrator if you believe this is an error.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Unauthorized;