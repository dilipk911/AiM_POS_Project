import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Home = memo(function Home() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is a modern, accessible React application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Home;