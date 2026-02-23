                <div className="text-2xl font-bold text-white mb-1">2.8m</div>
                <div className="text-sm text-gray-400">Avg. Session</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">42%</div>
                <div className="text-sm text-gray-400">New Visitors</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">58%</div>
                <div className="text-sm text-gray-400">Returning</div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">AdSense Status</span>
                <span className="text-yellow-400 font-medium">Pending Approval</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Application submitted. Typically takes 1-3 days.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Analytics update every 24 hours. 
            <span className="text-blue-400 ml-2">Last updated: {new Date().toLocaleString()}</span>
          </p>
          <p className="mt-2">
            Connect Google Analytics for real-time data. Add your GA4 Measurement ID in .env.local
          </p>
        </div>
      </div>
    </div>
  );
}