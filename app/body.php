<div class="container" ng-class="{loading: isLoading}">
    <header>
        <h1>Countries &amp; Capitals</h1>
        <nav>
            <a href="#/" ng-class="{disabled: activePage('/')}">Home</a>
            &nbsp;&#124;&nbsp;
            <a href="#/countries" ng-class="{disabled: activePage('countries')}">Browse Countries</a>
        </nav>
    </header>
    <section class="loader">
        <div class="spinner">
          <div class="cube1"></div>
          <div class="cube2"></div>
          <div class="cube3"></div>
          <div class="cube4"></div>
        </div>
    </section>
    <main class="main" ng-view>
        <!-- Content Here -->
    </main>
    <footer>
    </footer>
</div>