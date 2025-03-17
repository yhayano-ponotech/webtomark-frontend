// src/components/footer.tsx

export function Footer() {
    return (
      <footer className="border-t py-6 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Ponotech Inc. - All Rights Reserved.
            </div>
            
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    利用規約
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    プライバシーポリシー
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    お問い合わせ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }