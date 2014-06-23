<div class="container">
    <header>
        <h1>Countries &amp; Capitals</h1>
        <nav>
            <a href="#/" ng-class="{disabled: activePage('/')}">Home</a>
            &nbsp;&#124;&nbsp;
            <a href="#/countries" ng-class="{disabled: activePage('countries')}">Browse Countries</a>
        </nav>
    </header>
    <section ng-if="isLoading">
        Loading
    </section>
    <main class="main" ng-view ng-if="!isLoading">
        <!-- Content Here -->
    </main>
    <footer>
    </footer>
</div>