import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">About</h1>

      <Card>
        <CardHeader>
          <CardTitle>Calcount</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A simple, offline-first nutrition tracking application built with modern web technologies. 
            Track your daily food intake, monitor your nutrition goals, and maintain a healthy lifestyle.
          </p>

          
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Alok Mahapatra</h3>
              <p className="text-sm text-muted-foreground">Full Stack Developer</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://github.com/AlokMahapatra26" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Passionate about creating useful applications that help people maintain healthy lifestyles. 
            This nutrition tracker was built to be completely private and work offline.
          </p>
        </CardContent>
      </Card>

     
    </div>
  );
}
