
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Home, LogOut, PlusCircle, Clock, Search } from 'lucide-react';
import { historyStore, Generation } from '@/lib/historyStore';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [history, setHistory] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load history from localStorage
    setIsLoading(true);
    const items = historyStore.getAll();
    setHistory(items);
    setIsLoading(false);
  }, []);

  // Filter history items based on search term
  const filteredHistory = history.filter(item =>
    item.input.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Echo Avatar Fusion Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Your AI Generation History</h2>
            <p className="text-gray-400">View and manage your previous AI generations</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search history"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full rounded-md bg-gray-800 border border-gray-700 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 py-2"
              />
            </div>

            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Generation
              </Link>
            </Button>
          </div>
        </div>

        {/* History items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <Card key={idx} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="h-24 animate-pulse bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : filteredHistory.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700 col-span-full">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Clock className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">No history found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? "No results match your search" : "You haven't generated any AI content yet"}
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/" className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Create your first generation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map(item => (
              <Card key={item.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Generation
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`flex h-3 w-3 rounded-full ${
                          item.status === 'success' ? 'bg-green-500' :
                          item.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                      ></span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-gray-300 line-clamp-2">{item.input}</p>
                  {item.processingTime && (
                    <p className="text-gray-500 text-xs mt-2">
                      Processing time: {item.processingTime.toFixed(1)}s
                    </p>
                  )}
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-3 pb-3">
                  {item.status === 'success' ? (
                    <a href={item.outputUrl} download className="text-blue-400 hover:text-blue-300 text-sm">
                      Download output
                    </a>
                  ) : (
                    <span className="text-red-400 text-sm">{item.error || 'Generation failed'}</span>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
